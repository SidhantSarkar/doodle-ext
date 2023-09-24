import { TldrawApp } from "@tldrawe/tldraw"
import create from "zustand"

type State = {
    width: number,
    user: any,
    siteUrl: string,
    siteHash: string,
    newDoodle: boolean,
    doodleId: string,
    doodleTitle: string,
    author: any,
    isReadOnly: boolean,
    isPublic: boolean,
    loaded: boolean,
    shareMenuOpen: boolean,
    doodleMenuOpen: boolean,
    captureFrameClick: boolean,
    showOverlay: boolean,
    tlDrawApp: TldrawApp | null,
}

type initialState = {
    newDoodle: boolean,
    doodleId: string,
    doodleTitle: string,
    author: any,
    isReadOnly: boolean,
    isPublic: boolean,
}

type Action = {
    setWidth: (width: number) => void,
    setUser: (user: any) => void,
    setLoaded: (loaded: boolean) => void,
    setSiteDetails: (siteUrl: string, siteHash: string) => void,
    setDoodleId: (doodleId: string) => void,
    initialise: (initState: initialState) => void,
    reset: () => void,
    setTlDrawApp: (tlDrawApp: TldrawApp) => void,
    setShareMenuOpen: () => void,
    setDoodleMenuOpen: () => void,
    setShowOverlay: () => void,
    setIsPublic: (isPublic: boolean) => void,
    setDoodleTitle: (doodleTitle: string) => void,
}

export const useDoodleStore = create<State & Action>((set, get) => ({
    width: window.innerWidth,
    user: null,
    siteUrl: "",
    siteHash: "",
    newDoodle: false,
    doodleId: "",
    doodleTitle: "",
    author: null,
    isReadOnly: false,
    isPublic: false,
    loaded: false,
    shareMenuOpen: false,
    doodleMenuOpen: false,
    captureFrameClick: false,
    showOverlay: false,
    tlDrawApp: null,
    setWidth: (width) => set({ width }),
    setUser: (user) => { get().user !== user && set({ user }) },
    setLoaded: (loaded) => set({ loaded }),
    setSiteDetails: (siteUrl, siteHash) => set({ siteUrl, siteHash }),
    setDoodleId: (doodleId) => set({ doodleId }),
    initialise: (initState) => set({
        newDoodle: initState.newDoodle,
        doodleId: initState.doodleId,
        doodleTitle: initState.doodleTitle,
        author: initState.author,
        isReadOnly: initState.isReadOnly,
        isPublic: initState.isPublic,
        loaded: true
    }),
    reset: () => set({
        newDoodle: false,
        doodleId: "",
        doodleTitle: "",
        author: null,
        isReadOnly: false,
        isPublic: false,
        loaded: true
    }),
    setTlDrawApp: (tlDrawApp) => set({ tlDrawApp }),
    setShareMenuOpen: () => { get().shareMenuOpen ? set({ shareMenuOpen: false, captureFrameClick: false }) : set({ shareMenuOpen: true, captureFrameClick: true }) },
    setDoodleMenuOpen: () => { get().doodleMenuOpen ? set({ doodleMenuOpen: false, captureFrameClick: false }) : set({ doodleMenuOpen: true, captureFrameClick: true }) },
    setShowOverlay: () => { 
        const overlay = get().showOverlay
        const siteHash = get().siteHash
        const tlDrawApp = get().tlDrawApp

        if (overlay && siteHash && tlDrawApp) {
            sessionStorage.setItem(siteHash, JSON.stringify(tlDrawApp.document))
        }

        overlay ? set({ showOverlay: false }) : set({ showOverlay: true }) 
    },
    setIsPublic: (isPublic) => set({ isPublic }),
    setDoodleTitle: (doodleTitle) => set({ doodleTitle })
}))

