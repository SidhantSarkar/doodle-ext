import * as React from 'react'
import { Flex, Card, Heading, Button, Text, IconButton } from '@radix-ui/themes';
import { useDoodleStore } from '../hooks/store';
import { Cross1Icon } from '@radix-ui/react-icons';

export const ScreenSizeError = () => {
    const setShowOverlay = useDoodleStore(state => state.setShowOverlay)

    return (
        <Flex style={{
            height: "100vh",
            width: "100vw",
            zIndex: 10001, 
            inset: 0,
            paddingBottom: "5vh",
            justifyContent: "center",
        }} className='rt-DialogOverlay'>
            <Card style={{zIndex:10001, background: "var(--gray-1)", minWidth: "25%"}} variant="classic" size="3">
            
            <Flex direction="column" gap="5" align="start" style={{
                width: "100%",
            }}>
                <Flex direction="row" align="center" justify="between" style={{
                    width: "100%",
                }}>
                    <Heading size="5">Sorry Doodler!</Heading>
                    <IconButton size="2" variant="ghost" color='gray' onClick={setShowOverlay}>
                        <Cross1Icon width="16" height="16"/>
                    </IconButton>
                </Flex>
                <Flex direction="column" align="start" grow="1" gap="2" width="100%">
                    <Text as="p" size="3">You've gotta go big!</Text>
                    <Text as="p" size="3">Give your doodle a little room to breathe...</Text>
                    <Text as="p" mb="4" size="3">Increase window size to continue...</Text>
                </Flex>
                <Flex justify="end" align="center" style={{
                    width: "100%",
                }}>
                    <Button size="2" variant="ghost" color="gray" onClick={setShowOverlay}>
                        Cancel
                    </Button>
                </Flex>
            </Flex>
            </Card>
        </Flex>
    )
}