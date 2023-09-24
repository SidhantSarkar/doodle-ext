import * as React from 'react'
import { Flex, Text, Heading, Button, Dialog, TextField, IconButton, Select, Code, Separator, ScrollArea } from '@radix-ui/themes';
import { PersonIcon, CopyIcon, LockClosedIcon, GlobeIcon, InfoCircledIcon, Cross1Icon } from '@radix-ui/react-icons';
import { useQuery, useMutation } from '@tanstack/react-query'
import { UserPermission } from './UserPermission';
import { getPermissions, upsertPermission, updateDoodleState } from '../../api';
import { useDoodleStore } from '../hooks/store';
import { useFrame } from 'react-frame-component';
import { toast } from 'react-toastify';


export const ShareDoodle = () => {
  const { document }  = useFrame();

  const siteUrl = useDoodleStore(state => state.siteUrl)
  const doodleId = useDoodleStore(state => state.doodleId)
  const author = useDoodleStore(state => state.author)
  const user = useDoodleStore(state => state.user)
  const isPublic = useDoodleStore(state => state.isPublic)
  const isAuthor = user?.email === author?.email;

  const setIsPublic = useDoodleStore(state => state.setIsPublic)
  const shareMenuOpen = useDoodleStore(state => state.shareMenuOpen)
  const setShareMenuOpen = useDoodleStore(state => state.setShareMenuOpen)

  const [ currentPermission, setCurrentPermission ] = React.useState<string>('VIEW');
  const [ currentEmail, setCurrentEmail ] = React.useState<string>('');

  const emailInputRef = React.useRef<HTMLInputElement>(null);

  const copyToClipboard = React.useCallback(async () => {
    if (siteUrl && doodleId) {
      navigator.clipboard.writeText(`${siteUrl}#doodle=${doodleId}`)
      .then(() => {
        toast('Copied to clipboard!')
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }, [])

  const {data: getPermissionsData, refetch: getPermissionsRefetch, status: getPermissionsStatus } = useQuery({ 
    queryKey: ['getPermissions', { doodleId, author }], 
    queryFn: getPermissions, 
    enabled: !!doodleId && !!author 
  })
  
  const {mutate: upsertPermissionMutation, error: upsertPermissionError, isError: upsertPermissionIsError, isLoading: upsertPermissionLoading} = useMutation(upsertPermission, {
    onSuccess: () => {
      if (emailInputRef.current) emailInputRef.current.value = '';
      getPermissionsRefetch()
    },
  })

  const {mutate: updateDoodleStateMutation, isLoading: updateDoodleStateLoading} = useMutation(updateDoodleState)

  const visiblityHandler = React.useCallback((value: string) => {
    if (value === 'true') {
      setIsPublic(true)
    } else {
      setIsPublic(false)
    }
    updateDoodleStateMutation({ doodleId, isPublic: value === 'true' ? true : false })
  }, [setIsPublic, doodleId, updateDoodleStateMutation, isPublic])

  const inviteHandler = React.useCallback(() => {
    const email = currentEmail
    const operation = currentPermission

    try {
      upsertPermissionMutation({ email, operation, doodleId })
    } catch (err) {
      console.log(err)
    }
  }, [currentEmail, currentPermission, doodleId, upsertPermissionMutation])

  return (
      <Dialog.Root open={shareMenuOpen} onOpenChange={setShareMenuOpen}>
        {user?.email && (
        <Dialog.Content container={document?.body}>
          <Dialog.Title>
            <Flex width="100%" direction="row" align="center" justify="between">
              <Heading size="5">Share your Doodle</Heading>
              <Dialog.Close>
                <IconButton size="2" variant="ghost" color='gray'>
                  <Cross1Icon width="16" height="16"/>
                </IconButton>
              </Dialog.Close>
            </Flex>
          </Dialog.Title>
          { !doodleId ? (
            <Text as="div" size="3" color="gray" weight="bold">Please save Doodle to view sharing options</Text>
          ) : (
            <>
              <Flex direction="column" gap="2" mb="5">
                <Heading size="2" mb="2">Link to Doodle</Heading>
                <Flex style={{
                  background: "var(--blue-4)",
                  borderRadius: "var(--radius-4)"
                }} direction="row" width="100%" p="5" gap="4" >
                  <Flex direction="row" p="2" grow="1" style={{
                      background: "var(--gray-1)",
                      alignItems: "center",
                      justifyContent: 'flex-start',
                      borderRadius: "var(--radius-3)",
                      overflow: "clip",
                      textOverflow: "ellipsis",
                    }}>
                    <Code variant="ghost" color="gray"size="2" style={{
                      overflow: "clip",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {`${siteUrl}#doodle=${doodleId}`}
                    </Code>
                  </Flex>
                  <IconButton size="3" variant="solid" color='blue' onClick={copyToClipboard}>
                      <CopyIcon width="16" height="16" />
                  </IconButton>
                </Flex>
              </Flex>
              
              <Flex direction="column" gap="3">
                <Heading size="2" mb="2">Permissions</Heading>
                { isAuthor && (
                  <>
                    <Flex direction="row" gap="2">
                        <TextField.Root style={{
                          flexGrow: 1,
                        }} color={upsertPermissionIsError? 'red': 'blue'}>
                          <TextField.Slot>
                            <PersonIcon height="16" width="16" />
                          </TextField.Slot>
                          <TextField.Input placeholder="Enter Email" size="2" type='text' ref={emailInputRef} onChange={(e) => setCurrentEmail(e.target.value)} />
                          <TextField.Slot>
                            <Select.Root defaultValue={currentPermission} onValueChange={(value) => setCurrentPermission(value)}>
                              <Select.Trigger variant="ghost" color='blue'/>
                              <Select.Content color='blue' position="popper" container={document?.body}>
                                <Select.Item value="VIEW">Can View</Select.Item>
                                <Select.Item value="EDIT">Can Edit</Select.Item>
                              </Select.Content>
                            </Select.Root>
                          </TextField.Slot>
                        </TextField.Root>
                      <Button variant="solid" color='blue' size="2" onClick={inviteHandler} disabled={upsertPermissionLoading}>Invite</Button>
                    </Flex>
                    {
                      (upsertPermissionIsError) ? (
                        <Text as="div" size="1" color='red' style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          marginTop: "calc(-1 * var(--space-2))",
                          marginBottom: "calc(-1 * var(--space-2))"
                        }}><InfoCircledIcon /> {(upsertPermissionError as any).message} </Text>
                      ) : (
                        <Text style={{
                          marginTop: "calc(-1 * var(--space-2))",
                          marginBottom: "calc(-1 * var(--space-2))"
                        }} as="div" size="1" color='gray'> &nbsp; </Text>
                      )
                    }
                  </>
                )}
                
                <ScrollArea scrollbars="vertical" style={{maxHeight: "280px"}}>
                <Flex direction="column" width="100%" align="start" justify="center" gap="6" mt="4">
                {
                  getPermissionsStatus === 'loading' && (
                    <Text as="div" size="2" color="gray">Permissions are loading ...</Text>
                  )
                }
                {
                  getPermissionsStatus === 'error' && (
                    <Text as="div" size="2" color="gray">Error fetching permissions</Text>
                  )
                }
                {
                  getPermissionsStatus === 'success' && (
                    <>
                      {
                        getPermissionsData?.map((permission: any, idx: number) => (
                          <UserPermission key={idx} {...permission} isAuthor={isAuthor} doodleId={doodleId} />
                        ))
                      }
                    </>
                  )
                }
                </Flex>
                </ScrollArea>

                <Separator my="3" size="4" />

                <Flex direction="row" width="100%" align="center" justify="between">
                  { isAuthor ? (
                    <Select.Root defaultValue={isPublic ? 'true':'false'} size="2" onValueChange={visiblityHandler} disabled={updateDoodleStateLoading}>
                      <Select.Trigger variant="ghost" />
                      <Select.Content color='blue' position="popper" container={document?.body}>
                        <Select.Item value="false"><Text as="div" size="2" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                          }}><LockClosedIcon /> Only People Invited </Text></Select.Item>
                        <Select.Item value="true"><Text as="div" size="2" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                          }}><GlobeIcon /> Anyone with the link </Text></Select.Item>
                      </Select.Content>
                    </Select.Root>
                  ) : (
                    <>
                      {isPublic ? (
                        <Text as="div" size="2" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexDirection: 'row',
                          justifyContent: 'flex-start'
                        }}><GlobeIcon /> Anyone with the link </Text>
                      ) : (
                        <Text as="div" size="2" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexDirection: 'row',
                          justifyContent: 'flex-start'
                        }}><LockClosedIcon /> Only People Invited </Text>
                      )}
                    </>
                  ) }
                  <Text size="2">{isPublic ? 'Can view' : 'Can Access' }</Text>
                </Flex>
              </Flex>
            </>
          )}
        </Dialog.Content>)}
      </Dialog.Root>
  )
};