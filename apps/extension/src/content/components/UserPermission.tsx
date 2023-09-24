import React from 'react'
import { Flex, Text, Box, Avatar, Select } from '@radix-ui/themes';
import { upsertPermission, deletePermission } from '../../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFrame } from 'react-frame-component';

const capitalizeFirstLowercaseRest = (str: string) => {
    return (
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    )
}

export const UserPermission = (props: any) => {

    const { document } = useFrame();

    const queryClient = useQueryClient()

    const [ currentPermission, setCurrentPermission ] = React.useState<string>(props.role);

    const {mutate: upsertPermissionMutation, isLoading: upsertPermissionLoading} = useMutation(upsertPermission, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getPermissions']})
        }
    })

    const {mutate: deletePermissionMutation} = useMutation(deletePermission, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getPermissions']})
        }
    })

    const updatePermissionHandler = React.useCallback((value: string) => {
        setCurrentPermission(value);
        if (value === 'REMOVE') {
            deletePermissionMutation({ email: props.email, doodleId: props.doodleId })
        } else {
            upsertPermissionMutation({ email: props.email, operation: value, doodleId: props.doodleId })
        }
    }, [setCurrentPermission, upsertPermissionMutation, deletePermissionMutation, props.email, props.doodleId])

    return (
        <Flex gap="3" align="center" justify="between" style={{
            width: '100%',
        }}>
            <Flex gap="3" align="center">
                <Avatar
                    size="3"
                    src={props.image}
                    radius="full"
                    fallback="T"
                />
                <Box>
                    <Text as="div" size="2" weight="bold">
                    {props.name}
                    </Text>
                    <Text as="div" size="2" color="gray">
                    {props.email}
                    </Text>
                </Box>
            </Flex>
            
               { props.role === 'AUTHOR' ? (
                    <Text size="2">Author</Text>
                ) : (
                    <>
                    {props.isAuthor ? (
                        <Select.Root defaultValue={props.role} size="2" onValueChange={updatePermissionHandler} disabled={upsertPermissionLoading || currentPermission === 'REMOVE'}>
                        <Select.Trigger variant="ghost"/>
                        <Select.Content color='blue' position="popper" container={document?.body}>
                            <Select.Item value="VIEW">Can View</Select.Item>
                            <Select.Item value="EDIT">Can Edit</Select.Item>
                            <Select.Item value="REMOVE">Remove</Select.Item>
                        </Select.Content>
                    </Select.Root>
                    ) : (<Text size="2">{'Can ' + capitalizeFirstLowercaseRest(props.role)}</Text>)}
                    </>
                    
                )}
        </Flex>
    )
}