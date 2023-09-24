import React from 'react'
import { Flex } from '@radix-ui/themes'
import { useDoodleStore } from '../hooks/store';
import { ShareDoodle } from './ShareDoodle';
import { LoadDoodle } from './LoadDoodle';
import { LoginCard } from './LoginCard';
import { toast } from 'react-toastify';
import { ScreenSizeError } from './ScreenSizeError';

const MIN_SCREEN_WIDTH = 1280

export const DoodleUtils = () => {
    const user = useDoodleStore(state => state.user)
    const loaded = useDoodleStore(state => state.loaded)
    const width = useDoodleStore(state => state.width)

    React.useEffect(() => {
        if (!loaded) toast('Hold on, we are loading your doodle!')
    }, [loaded])

    return (
        <>
            {user?.email ? (
                <Flex style={{
                    position: 'fixed',
                    height: '100vh',
                    width: '100vw',
                    zIndex: 10001,
                    top: 0,
                    left: 0
                }} >
                    { loaded && (
                        <>
                            <ShareDoodle  />
                            <LoadDoodle />
                        </>
                    )}
                    { width < MIN_SCREEN_WIDTH && (
                        <ScreenSizeError />
                    ) }
                </Flex>
                
            ) : (
                <LoginCard />
            )}
        </>
    )
        
}