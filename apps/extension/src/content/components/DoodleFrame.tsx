import React from "react"
import { DoodleUtils } from "./DoodleUtils"
import Frame, { useFrame } from "react-frame-component"
import { Theme } from "@radix-ui/themes"
import {radixStyles, customStyles} from "../styles"
import { useDoodleStore } from "../hooks/store"

const MIN_SCREEN_WIDTH = 1280

const StyleWrapper = (props: any) => {
    const { document }  = useFrame();

    React.useLayoutEffect(() => {
        const styleRadix = (document as HTMLDocument).createElement("style")
        styleRadix.innerHTML = radixStyles
        styleRadix.setAttribute("id", "radix-style")
        document?.head.appendChild(styleRadix);

        const styleCustom = (document as HTMLDocument).createElement("style")
        styleCustom.innerHTML = customStyles
        styleCustom.setAttribute("id", "custom-style")
        document?.head.appendChild(styleCustom);

        return () => {
            document?.head.removeChild(styleRadix);
            document?.head.removeChild(styleCustom);
        }
    }, []);

    return (
        <>
            {props.children}
        </>
    )
}

export const DoodleFrame = () => {

    const captureFrameClick = useDoodleStore(state => state.captureFrameClick)
    const user = useDoodleStore(state => state.user)
    const width = useDoodleStore(state => state.width)

    return (
        <Frame style={{
            position: 'fixed',
            inset: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 10000,
            pointerEvents: (captureFrameClick || !user || width < MIN_SCREEN_WIDTH) ? 'auto' : 'none',
            colorScheme: 'auto',
            border: 'none'
        }} 
        initialContent='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"></head><body><div></div></body></html>'
        >
            <StyleWrapper>
                <Theme hasBackground={false}>
                    <DoodleUtils />
                </Theme>
            </StyleWrapper>
        </Frame>
    )
}