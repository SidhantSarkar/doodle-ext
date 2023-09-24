import React, { useState } from "react"
import { Flex, Text } from '@radix-ui/themes';
import { useDoodleStore } from "../hooks/store";
import { useQueryClient } from "@tanstack/react-query";
import { DoodleSvg } from "./DoodleSvg";

const colors = ["blue", "jade", "tomato", "plum", "iris", "orange", "teal", "violet"]
const validNames = ['check', 'crown', 'cute', 'dizzy', 'hurricane', 'love', 'shock', 'sleepy', 'star']

export const DoodleCard = (props: any) => {

    const queryClient = useQueryClient()
    const seed = props.seed

    const rotatedNames = React.useMemo(() => {
        return [...validNames.slice(seed), ...validNames.slice(0, seed)]
    }, [seed])

    const doodleId = useDoodleStore(state => state.doodleId)
    const setDoodleId = useDoodleStore(state => state.setDoodleId)
    const setLoaded = useDoodleStore(state => state.setLoaded)

    
    const index = props.idx % colors.length;
    const shapeIndex = props.idx % validNames.length;

    const [isHover, setIsHover] = useState(false);
    
    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };

    const handleClick = React.useCallback(() => {
        if (props.doodle.doodleId === doodleId) return
        setDoodleId(props.doodle.doodleId)
        setLoaded(false)
        queryClient.invalidateQueries({ queryKey: ['getDoodle']})
    }, [props.doodle.doodleId, doodleId])
    
    return (
        <Flex direction="row" align="center" justify="center" p="4" gap="4" style={{
            background: (isHover) ? `var(--${colors[index]}-5)` : `var(--${colors[index]}-3)`,
            borderRadius: "var(--radius-4)",
            cursor: doodleId === props.doodle.doodleId ? "default" : "pointer",
            border: (doodleId === props.doodle.doodleId) ? `2px solid var(--${colors[index]}-9)` : "none",
         }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
            <DoodleSvg 
                height="3.8rem"
                width="3.8rem"
                color={colors[index]}
                fill={true}
                svgName={rotatedNames[shapeIndex]}
            />
            <Flex direction="column" gap="1" justify="center" grow="1" align="start" height="100%" style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}>
            <Text as="span" color="gray" mb="1" size="1" style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}>
                @{props.doodle.author.name} { doodleId === props.doodle.doodleId && (<> | <em>Active</em></>)}
            </Text>
            <Text as="span" color="gray" size="3" style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}>
                {props.doodle.title}
            </Text>
            </Flex>
        </Flex>
    )
}