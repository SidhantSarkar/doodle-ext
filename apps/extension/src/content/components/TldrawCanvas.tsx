import React from "react"
import { Tldraw, TldrawApp } from '@tldrawe/tldraw'
import { usePan } from "../hooks"
import browser from 'webextension-polyfill'
import { useDoodleStore } from "../hooks/store"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { updateDoodle } from "../../api"

const MIN_SCREEN_WIDTH = 1280

export const TldrawCanvas = () => {

    const siteHash = useDoodleStore(state => state.siteHash)
    const doodleId = useDoodleStore(state => state.doodleId)
    const isReadOnly = useDoodleStore(state => state.isReadOnly)
    const user = useDoodleStore(state => state.user)
    const loaded = useDoodleStore(state => state.loaded)
    const width = useDoodleStore(state => state.width)

    const setShowOverlay = useDoodleStore(state => state.setShowOverlay)
    const setShareMenuOpen = useDoodleStore(state => state.setShareMenuOpen)
    const setDoodleMenuOpen = useDoodleStore(state => state.setDoodleMenuOpen)
    
    const {mutate: updateDoodleDocumentMutation, isLoading: updateDoodleDocumentLoading} = useMutation(updateDoodle, {
        onSuccess: () => {
            toast('Doodle Saved!');
        }
    })

    const onOpenProject = React.useCallback(
        async (app: TldrawApp) => {
            setDoodleMenuOpen()
        }, [setDoodleMenuOpen]
    )

    const onSaveProject =  React.useCallback( 
        async (app: TldrawApp) => {
            
            if (updateDoodleDocumentLoading) return;
            if (app.readOnly) return;

            if (!doodleId) {
                setDoodleMenuOpen()                
                return
            }

            try {
                const document: any = app.document
                document.size = {height: window.innerHeight, width: window.innerWidth};
                updateDoodleDocumentMutation({ doodleId, data: document })
                app.saveProject()
              } catch (e: any) {
                // Likely cancelled
                console.error(e.message)
              }
        }, [doodleId, updateDoodleDocumentMutation, setDoodleMenuOpen]
    );

    const { setZoom, onMount, onPan } = usePan(siteHash)

    const configs = React.useMemo(() => ({
        onPan,
        onMount,
        onSaveProject,
        onOpenProject,
        readOnly: isReadOnly,
        showMenu: true,
        showSponsorLink: false,
        showZoom: false,
        showPages: false,
        disableAssets: true,
        setShareMenuOpen,
        setDoodleMenuOpen,
    }), [onPan, onMount, isReadOnly]) 

    /**
    * Register an event listener to listen to messages from an extension process
    */
    React.useEffect(() => {
        const onReceiveMessage = (message: any) => {
            if (message.toggle) {
                setShowOverlay()
            }
            if (message.zoom) {
                setZoom(message.zoom)
            }
        }

        browser.runtime.onMessage.addListener(onReceiveMessage)

        return () => {
            browser.runtime.onMessage.removeListener(onReceiveMessage)
        }
    }, [])

    return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            height: '100%',
            width: '100%',
            zIndex: 10000,
          }}
        >
            {(user?.email && loaded && (width >= MIN_SCREEN_WIDTH)) && ( <Tldraw {...configs}/> )}
        </div>
    )
}