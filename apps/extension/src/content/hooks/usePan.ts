import React from 'react'
import { TDDocument, TldrawApp } from '@tldrawe/tldraw'
import { TLWheelEventHandler } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { normalizeDelta } from '../utils'
import browser from 'webextension-polyfill'
import { useDoodleStore } from './store'
import { scaleDocumentSize } from '../utils/init'

export function usePan( siteHash: string ) {
  const setTlDrawApp = useDoodleStore(state => state.setTlDrawApp)
  const isReadOnly = useDoodleStore(state => state.isReadOnly)
  
  const [tldraw, setTldraw] = React.useState<TldrawApp>()
  const [zoom, setZoom] = React.useState<number>(1)
  const yOffset = React.useRef<number>(window.scrollY)
  const xOffset = React.useRef<number>(window.scrollX)

  /**
   * Request for the page zoom info on mount
   */
  React.useEffect(() => {
    browser.runtime
      .sendMessage({
        type: 'zoom',
      })
      .then((result: any) => {
        setZoom(result as number)
      })
      .catch((err) => {
        console.warn(err)
      })
  }, [])

  const onMount = React.useCallback((app: TldrawApp) => {
    app.pausePan() // Turn off the app's pan handling
    app.pauseZoom() // Turn off the app's zoom handling

    const existingDocument = sessionStorage.getItem(siteHash)
    if (existingDocument) {
      // Set readOnly to false so that the app can be loaded
      app.readOnly = false
      app.loadDocument(JSON.parse(existingDocument) as TDDocument)
      app.readOnly = isReadOnly
    } else {
      app.resetDocument()
      const document: any = app.document
      document.size = {height: window.innerHeight, width: window.innerWidth};
    }
    app.persist()

    // reset camera on mount and pan camera to the y-offset of the page
    app.resetCamera()
    app.pan([0, window.scrollY])
    setTlDrawApp(app)
    scaleDocumentSize()
    setTldraw(app)
  }, [siteHash])

  /**
   * A callback to handle window scrolling when the canvas camera is
   */
  const onPan: TLWheelEventHandler = React.useCallback(
    (info, e) => {
      if (!tldraw) return

      if (tldraw.appState.status === 'pinching') return

      const normalizedDelta = normalizeDelta(info.delta, zoom)

      const prev = tldraw.pageState.camera.point
      const next = Vec.sub(prev, normalizedDelta)

      if (Vec.isEqual(next, prev)) return

      // isPanning.current = true
      window.scrollBy(normalizedDelta[0], normalizedDelta[1])

      if (!tldraw.isForcePanning) tldraw.onPointerMove(info, e as unknown as React.PointerEvent)
    },
    [tldraw, zoom]
  )

  /**
   * Update the session storage value when the tldraw page changes
   */
  const onChangePage = React.useCallback(
    (app: TldrawApp) => {
      sessionStorage.setItem(siteHash, JSON.stringify(app.document))
    },
    [siteHash]
  )

  const onScrollHandler = React.useCallback(
    (e: Event) => {
      const yDelta = window.scrollY - yOffset.current
      yOffset.current = window.scrollY

      const xDelta = window.scrollX - xOffset.current
      xOffset.current = window.scrollX
      
      if (tldraw) {
        tldraw.pan([xDelta, yDelta])
      }
    },
    [tldraw]
  )

  /**
   * Register an event listener to listen to user generated scroll events
   */
  React.useEffect(() => {
    window.addEventListener('scroll', onScrollHandler)

    return () => {
      window.removeEventListener('scroll', onScrollHandler)
    }
  }, [onScrollHandler])

  return {
    setZoom,
    onMount,
    onPan,
    onChangePage,
  }
}
