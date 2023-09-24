import React from "react"
import { Flex } from "@radix-ui/themes"
import * as Svg from '../assets'

const validNames = ['check', 'crown', 'cute', 'dizzy', 'hurricane', 'love', 'shock', 'sleepy', 'star']

export const DoodleSvg = (props: any) => {

    const { fill, color, svgName, height, width } = props

    if (!validNames.includes(svgName)) {
        return null
    }

    const resolve = React.useCallback(() => {
        const strokeColor = fill ? 'var(--gray-1)' : `var(--${color}-9)`
        switch (svgName) {
            case 'check':
                return <Svg.CheckSvg stroke={strokeColor} fill={strokeColor} style={{width: "90%", height: "90%"}}/>
            case 'crown':
                return <Svg.CrownSvg stroke={strokeColor} fill={strokeColor} style={{width: "90%", height: "90%"}}/>
            case 'cute':
                return <Svg.CuteSvg stroke={strokeColor} fill={strokeColor} style={{width: "90%", height: "90%"}}/>
            case 'dizzy':
                return <Svg.DizzySvg stroke={strokeColor} fill={strokeColor} style={{width: "90%", height: "90%"}}/>
            case 'hurricane':
                return <Svg.HurricaneSvg stroke={strokeColor} fill={strokeColor} style={{width: "75%", height: "75%"}}/>
            case 'love':
                return <Svg.LoveSvg stroke={strokeColor} fill={strokeColor} style={{width: "90%", height: "90%"}}/>
            case 'shock':
                return <Svg.ShockSvg stroke={strokeColor} fill={strokeColor} style={{width: "90%", height: "90%"}}/>
            case 'sleepy':
                return <Svg.SleepySvg stroke={strokeColor} fill={strokeColor} style={{width: "90%", height: "90%"}}/>
            case 'star':
                return <Svg.StarSvg stroke={strokeColor} fill={strokeColor} style={{width: "90%", height: "90%"}}/>
        }
    }, [fill, color, svgName])

    return (
        <>
            {fill ? (
                <Flex style={{
                    background: `var(--${color}-9)`,
                    width: width,
                    height: height,
                    minWidth: width,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-4)"
                }}>
                    {resolve()}
                </Flex>
            ) : (
                <Flex style={{
                    width: width,
                    height: height,
                    minWidth: width,
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent"
                }}>
                    {resolve()}
                </Flex>
            )}
        </>
    )
}