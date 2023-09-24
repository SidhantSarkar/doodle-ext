import React from 'react'
import isHotkey from 'is-hotkey'

import { useQuery } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './styles/content.css'


import { TldrawCanvas, DoodleFrame } from './components'
import { useDoodleStore } from './hooks/store';

import { authCheck, getMyDoodleIdFromHash, getDoodleFromId } from '../api';
import { updateSiteDetails, setDoodleState, scaleDocumentSize } from './utils/init';

const TOGGLE_OVERLAY = 'mod+shift+e'

const debounce = (fn: any, delay: number) => {
  let timeoutId: any
  return function (...args: any) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = null
      fn(...args)
    }, delay)
  }
}

const Content = () => {

  const showOverlay = useDoodleStore(state => state.showOverlay)
  const user = useDoodleStore(state => state.user)
  const siteHash = useDoodleStore(state => state.siteHash)
  const doodleId = useDoodleStore(state => state.doodleId)

  const setShowOverlay = useDoodleStore(state => state.setShowOverlay)
  const setUser = useDoodleStore(state => state.setUser)
  const setDoodleId = useDoodleStore(state => state.setDoodleId)
  const reset = useDoodleStore(state => state.reset)

  const { data: userData, isSuccess: userDataSuccess, isError: userDataError } = useQuery({ 
    queryKey: ['authCheck'], 
    queryFn: authCheck,
    retry: false
  })

  const { data: doodleIdData, isSuccess: doodleIdDataSuccess, isError: doodleIdDataError } = useQuery({
    queryKey: ['resolveSiteHash', {siteHash}],
    queryFn: getMyDoodleIdFromHash,
    enabled: !!user && !!siteHash,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: (failureCount, error) => {
      if (error === 'Not Found') {
        return false
      }
      return failureCount < 3
    }
  })

  const { data: doodleData, isSuccess: doodleDataSuccess, isError: doodleDataError } = useQuery({
    queryKey: ['getDoodle', {doodleId} ],
    queryFn: getDoodleFromId,
    enabled: !!user && !!siteHash && !!doodleId,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: (failureCount, error) => {
      if (error === 'Not Found') {
        return false
      }
      return failureCount < 3
    }
  })

  React.useEffect(() => {
    if (userDataSuccess) {
      setUser(userData)
      updateSiteDetails()
    } else if (userDataError) {
      setUser(null)
      reset()
    }
  }, [userDataSuccess, userDataError, userData])

  React.useEffect(() => {
    if (doodleIdDataSuccess) {
      setDoodleId(doodleIdData as string)
    } else if (doodleIdDataError) {
      setDoodleState()
    }
  }, [doodleIdDataSuccess, doodleIdDataError, doodleIdData])

  React.useEffect(() => {
    if (doodleDataSuccess) {
      setDoodleState(doodleData)
    } else if (doodleDataError) {
      setDoodleState()
    }
  }, [doodleDataSuccess, doodleDataError, doodleData])

  React.useEffect(() => {
    const resizeHandler = () => {
      debounce(() => {
        scaleDocumentSize()
      }, 1000)()
    }

    window.addEventListener('resize', resizeHandler, false)

    return () => {
      window.removeEventListener('resize', resizeHandler, false)
    }
  }, [])

  /**
   * Register an event listener to listen to keyboard events to toggle overlay
   */
  React.useEffect(() => {
    const displayOverlayKeyHandler = (e: KeyboardEvent) => {
      if (isHotkey(TOGGLE_OVERLAY, e)) {
        setShowOverlay()
      }
    }

    window.addEventListener('keydown', displayOverlayKeyHandler, false)

    return () => {
      window.addEventListener('keydown', displayOverlayKeyHandler, false)
    }
  }, [])

  return (
    <>
      {showOverlay && (
        <>
          <TldrawCanvas />
          <DoodleFrame />
        </>
      )}
      <ToastContainer position='bottom-right' autoClose={3000} hideProgressBar={true} newestOnTop={true} pauseOnFocusLoss={false} closeOnClick={true} draggable={false}/>
    </>
  )
}

export default Content
