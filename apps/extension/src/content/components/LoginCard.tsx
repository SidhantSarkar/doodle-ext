import * as React from 'react'
import { Cross1Icon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Flex, Callout, Card, Heading, Button, Text, IconButton } from '@radix-ui/themes';
import { useDoodleStore } from '../hooks/store';
import { DoodleSvg } from './DoodleSvg';

export const LoginCard = () => {
    const setShowOverlay = useDoodleStore(state => state.setShowOverlay)

    const openLogin = () => {
        window.open(`${process.env.API_URL}/auth/login?closeOnSuccess=true`, '_blank');
        setShowOverlay()
    }

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
                    <Heading size="5">Login to doodle!</Heading>
                    <IconButton size="2" variant="ghost" color='gray' onClick={setShowOverlay}>
                        <Cross1Icon width="16" height="16"/>
                    </IconButton>
                </Flex>

                <Flex direction="column" gap="2" align="start" style={{
                    width: "100%",
                }}>
                    <Flex direction="row" gap="4" align="baseline" justify="center" style={{
                        width: "100%",
                    }}>
                        <Flex direction="column" align="start" grow="1" gap="2" style={{
                            alignSelf: "center",
                        }}>
                            <Heading mb="2" size="3">Hey Doodler!</Heading>
                            <Text as="p" size="2">You are on the right path!</Text>
                            <Text as="p" mb="4" size="2">Just login to start doodling..</Text>
                        </Flex>
                        <DoodleSvg 
                            height="6.4rem"
                            width="6.4rem"
                            color="blue"
                            fill={false}
                            svgName="crown"
                        />
                    </Flex>
                    <Flex gap="4" justify="end" align="center" style={{
                        width: "100%",
                    }}>
                        <Button size="2" variant="ghost" color="gray" onClick={setShowOverlay}>
                            Cancel
                        </Button>
                        <Button size="2" variant="solid" color="blue" onClick={openLogin}>
                            Login
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
            </Card>
        </Flex>
    )
}