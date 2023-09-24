import * as React from 'react'
import { Flex, Text, Tabs, Box, Button, Dialog, Heading, IconButton, Link, Slot, Grid, ScrollArea } from '@radix-ui/themes';
import { Pencil1Icon, CheckIcon, Cross1Icon } from '@radix-ui/react-icons';
import { DoodleCard } from './DoodleCard';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@tanstack/react-query'

import { getDoodleFromHash, updateDoodleState, updateDoodle, saveNewDoodle } from '../../api';
import { useDoodleStore } from '../hooks/store';
import { useFrame } from 'react-frame-component';
import { DoodleSvg } from './DoodleSvg';

const validNames = ['check', 'crown', 'cute', 'dizzy', 'hurricane', 'love', 'shock', 'sleepy', 'star']

export const LoadDoodle = () => {

  const { document }  = useFrame();
  const seed = React.useMemo(() => Math.floor(Math.random() * 10) % validNames.length, [])

  const user = useDoodleStore(state => state.user)
  const author = useDoodleStore(state => state.author)
  const siteHash = useDoodleStore(state => state.siteHash)
  const siteUrl = useDoodleStore(state => state.siteUrl)
  const doodleId = useDoodleStore(state => state.doodleId)
  const doodleTitle = useDoodleStore(state => state.doodleTitle)
  const isReadOnly = useDoodleStore(state => state.isReadOnly)
  const doodleMenuOpen = useDoodleStore(state => state.doodleMenuOpen)
  const tlDrawApp = useDoodleStore(state => state.tlDrawApp)

  const isAuthor = user?.email === author?.email;

  const setDoodleMenuOpen = useDoodleStore(state => state.setDoodleMenuOpen)
  const setDoodleTitle = useDoodleStore(state => state.setDoodleTitle)
  const setDoodleId = useDoodleStore(state => state.setDoodleId)

  const [toggle, setToggle] = React.useState(true);
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  
  const {data: getDoodleData, isLoading: getDoodleDataLoading, refetch: getDoodleDataRefetch } = useQuery({ 
    queryKey: ['doodleHash', { user, siteHash }], 
    queryFn: getDoodleFromHash, 
    enabled: !!siteHash && !!user 
  })
  
  const {mutate: updateDoodleStateMutation, isLoading: updateDoodleStateLoading} = useMutation(updateDoodleState, {
    onSuccess: () => {
      getDoodleDataRefetch()
    }
  })

  const {mutate: updateDoodleMutation, isLoading: updateDoodleLoading} = useMutation(updateDoodle, {
    onSuccess: () => {
      toast('Doodle Saved!');
    }
  })

  const {mutate: saveNewDoodleMutation, isLoading: saveNewDoodleLoading} = useMutation(saveNewDoodle, {
    onSuccess: (data: {created: string}) => {
      setDoodleId(data.created);
      toast('New Doodle Saved!');
      getDoodleDataRefetch()
    }
  })

  const saveHandler = React.useCallback(() => {
    const document: any = tlDrawApp?.document
    if (!document) return
    document.size = {height: window.innerHeight, width: window.innerWidth};
    if (doodleId) {
      updateDoodleMutation({ doodleId, data: document })      
    } else if (!doodleId) {
      saveNewDoodleMutation({ title: doodleTitle, data: document, siteHash, siteUrl })
    }
    tlDrawApp?.saveProject()
  }, [tlDrawApp, doodleId, doodleTitle, siteHash, siteUrl, updateDoodleMutation, saveNewDoodleMutation])

  const handleToggle = React.useCallback(() => {
    if (!isAuthor) return;
    if (doodleId) {
      updateDoodleStateMutation({ doodleId, title: doodleTitle })
    }
    setToggle((toggle) => !toggle);
  }, [isAuthor, doodleId, doodleTitle, updateDoodleStateMutation])

  const updateDoodleName = (e: any) => {
    setDoodleTitle(e.target.value);
  }

  React.useEffect(() => {
    if (!doodleId) {
      setToggle(false)
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }
  }, [])

  return (
      <Dialog.Root open={doodleMenuOpen} onOpenChange={setDoodleMenuOpen}>
        {user?.email && (
        <Dialog.Content container={document?.body}>
          <Dialog.Title>
            <Flex width="100%" direction="row" align="center" justify="between">
              <Heading size="5">Doodles for this site</Heading>
              <Dialog.Close>
                <IconButton size="2" variant="ghost" color='gray'>
                  <Cross1Icon width="16" height="16"/>
                </IconButton>
              </Dialog.Close>
            </Flex>
          </Dialog.Title>
          
          <Flex direction="column" gap="2" mb="4">
            <Heading size="2" mb="2">Active Doodle</Heading>
            <Flex style={{
              background: "var(--blue-4)",
              borderRadius: "var(--radius-4)"
            }} direction="row" width="100%" p="4" gap="4" >
              <DoodleSvg 
                height="5.4rem"
                width="5.4rem"
                fill={true}
                color="blue"
                svgName={validNames[seed]}
              />
              <Flex direction="row" p="4" grow="1" style={{
                  background: "var(--gray-1)",
                  alignItems: "center",
                  justifyContent: 'center',
                  borderRadius: "var(--radius-4)"
                }} gap="4">
                <Flex direction="column" grow="1" style={{
                  alignItems: "flex-start",
                  justifyContent: 'center',
                }}>
                  <Text as="div" color="gray" mb="2" size="2">
                    @{author.name}
                  </Text>
                  <Flex width="100%">
                    {
                      isAuthor ? (
                        <>
                          {toggle ? (<Link color="gray" size="4" style={{
                            color: "var(--gray-12)",
                          }} className='display-on-hover' onClick={() => setToggle(false)}>
                            {doodleTitle} <Slot><Pencil1Icon/></Slot>
                          </Link>) : 
                          (<Flex className='input-edit' direction="row" width="100%" align="center" >
                            <input defaultValue={doodleTitle} onChange={updateDoodleName} ref={titleInputRef}/>
                            <IconButton size="1" variant="ghost" onClick={handleToggle} color='gray' disabled={updateDoodleStateLoading}>
                              <CheckIcon height="15" width="15" />
                            </IconButton>
                          </Flex>)}
                        </>
                      ) : (
                        <Text as="div" color="gray" size="4" style={{
                          color: "var(--gray-12)",
                        }}>
                          {doodleTitle}
                        </Text>
                      )
                    }
                  </Flex>
                </Flex>
                {
                  !isReadOnly && (
                    <Flex p="4"><Button variant='ghost' color='blue' onClick={saveHandler} disabled={updateDoodleLoading || saveNewDoodleLoading}>Save</Button></Flex>
                  )
                }
              </Flex> 
            </Flex>
          </Flex>
          

          <Tabs.Root defaultValue="my-doodle">
            <Tabs.List>
              <Tabs.Trigger value="my-doodle">My Doodle</Tabs.Trigger>
              <Tabs.Trigger value="shared-with-me">Shared with Me</Tabs.Trigger>
              <Tabs.Trigger value="public">Public</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3" pb="2">
              <Tabs.Content value="my-doodle">
                {
                  getDoodleDataLoading ? (<Text size="2">Loading...</Text>) : (
                    <ScrollArea type="auto" scrollbars="vertical" style={{maxHeight: "180px", minHeight: "180px"}}>
                      {
                        (getDoodleData?.myDoodles as any).length > 0 ? (
                          <Grid columns="2" gap="4" width="auto">
                            {
                              getDoodleData?.myDoodles?.map((doodle: any, idx: number) =>
                                  <DoodleCard key={idx} idx={idx} doodle={doodle} seed={seed}/>
                              )
                            }
                            {/* {[...Array(10)].map((x, i) =>
                              <DoodleCard key={i} idx={i}/>
                            )} */}

                          </Grid>
                        ) : (<Text size="3" color='gray'>Please save doodle to continue...</Text>)
                      }
                    </ScrollArea>
                  )
                }
              </Tabs.Content>

              <Tabs.Content value="shared-with-me">
                {
                  getDoodleDataLoading ? (<Text size="2">Loading...</Text>) : (
                    <ScrollArea type="auto" scrollbars="vertical" style={{maxHeight: "180px", minHeight: "180px"}}>
                      {
                        (getDoodleData?.sharedDoodles as any).length > 0 ? (
                          <Grid columns="2" gap="4" width="auto">
                            {
                              getDoodleData?.sharedDoodles?.map((doodle: any, idx: number) =>
                                  <DoodleCard key={idx} idx={idx} doodle={doodle} seed={seed}/>
                              )
                            }
                          </Grid>
                        ) : (<Text size="3" color='gray'>Don't be sad. Ask someone to share a doodle...</Text>)
                      }
                    </ScrollArea>
                  )
                }
              </Tabs.Content>

              <Tabs.Content value="public">
                {
                  getDoodleDataLoading ? (<Text size="2">Loading...</Text>) : (
                    <ScrollArea type="auto" scrollbars="vertical" style={{maxHeight: "180px", minHeight: "180px"}}>
                        {
                          (getDoodleData?.publicDoodles as any).length > 0 ? (
                            <Grid columns="2" gap="4" width="auto">
                              {
                                getDoodleData?.publicDoodles?.map((doodle: any, idx: number) =>
                                    <DoodleCard key={idx} idx={idx} doodle={doodle} seed={seed}/>
                                )
                              }
                            </Grid>
                          ) : (<Text size="3" color='gray'>You can start the fire. Make your doodle public...</Text>)
                        }
                    </ScrollArea>
                  )
                }
              </Tabs.Content>
            </Box>
          </Tabs.Root>

        </Dialog.Content>)}
      </Dialog.Root>
  )
};