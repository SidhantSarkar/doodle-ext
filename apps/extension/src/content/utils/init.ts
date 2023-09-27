import { TldrawApp } from "@tldrawe/tldraw";
import { useDoodleStore } from "../hooks/store";
import { MD5 } from "./md5";

type Doodle = {
    id: string,
    title: string,
    author: any,
    isPublic: boolean,
    permissions: [],
    data: any,
} | undefined

export const updateSiteDetails = async () => {
    let doodleId = '';
    const url = new URL(window.location.href);
    const res = url.hash.split('#doodle=');
    if (res.length > 1) doodleId = res[1]; 
    url.hash = '';
    const url_hash = MD5(url.toString())
    useDoodleStore.getState().setSiteDetails(url.toString(), url_hash)
    if (doodleId) {
        useDoodleStore.getState().setDoodleId(doodleId)
        history.pushState("", document.title, window.location.pathname+window.location.search)
    }
}

export const scaleDocumentSize = () => {

    const targetWidth = window.innerWidth
    const setWidth = useDoodleStore.getState().setWidth
    setWidth(targetWidth)

    const tlDrawApp = useDoodleStore.getState().tlDrawApp as TldrawApp
    if (!tlDrawApp || !tlDrawApp.document) return

    const currentWidth = (tlDrawApp.document as any).size.width
    if(targetWidth === currentWidth) return

    const delta = (targetWidth - currentWidth) / 2

    tlDrawApp.getShapes().forEach((shape: any) => {
        shape.point = [shape.point[0] + delta, shape.point[1]]
    });

    (tlDrawApp.document as any).size.width = targetWidth
    tlDrawApp.persist()
}

export const setDoodleState = async (doodle: Doodle = {} as any) => {
    const user = useDoodleStore.getState().user
    const siteHash = useDoodleStore.getState().siteHash
    if (Object.keys(doodle).length === 0 && doodle.constructor === Object) {
        useDoodleStore.getState().initialise({
            newDoodle: true,
            doodleId: '',
            doodleTitle: 'New Doodle',
            author: user,
            isReadOnly: false,
            isPublic: false,
        })
        sessionStorage.removeItem(siteHash)
    } else {
        let isReadOnly = false;
        doodle.permissions.forEach((element: any) => {
            if (element.user.email === user.email && element.operation === 'VIEW') {
                isReadOnly = true;
            }
        })
        useDoodleStore.getState().initialise({
            newDoodle: false,
            doodleId: doodle.id,
            doodleTitle: doodle.title,
            author: doodle.author,
            isReadOnly: isReadOnly,
            isPublic: doodle.isPublic,
        })
        sessionStorage.setItem(siteHash, JSON.stringify(doodle.data)) 
        const showOverlay = useDoodleStore.getState().showOverlay
        const tlDrawApp = useDoodleStore.getState().tlDrawApp
        if (showOverlay && tlDrawApp) {
            tlDrawApp.loadDocument(doodle.data)
            tlDrawApp.persist()
            scaleDocumentSize()
        }
    }
}