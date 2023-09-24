import {communicate} from '../content/utils/browserCommunication'

type getPermissionsParam = [
    _key: string,
    items: {
        doodleId: string,
        author: {
            id: string,
            name: string,
            email: string,
        }
    }
]

type upsertPermissionsParam = {
    email: string,
    operation: string,
    doodleId: string
}

type deletePermissionsParam = {
    email: string,
    doodleId: string
}

const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const getPermissions = async ({ queryKey }: { queryKey: getPermissionsParam }) : Promise<any[]> => {
    const [_key, {doodleId, author}] = queryKey;

    if (!doodleId) {
        throw new Error('Doodle ID is required')
    }

    return new Promise((resolve, reject) => {
        communicate('GET_PERMISSIONS', { doodleId })
        .then((resp) => {
            const permissions = [
                {
                    role: 'AUTHOR',
                    ...author
                }
            ]
            if (resp.data.length > 0) {
                resp.data.forEach((element: any) => {
                    permissions.push({
                        role: element.operation,
                        ...element.user
                    })
                })
            }
            resolve(permissions)
        })
        .catch((err) => {
            reject(err.data.error)
        })
    })
}

export const upsertPermission = async (data: upsertPermissionsParam) => {
    
    if (!data.doodleId) {
        throw new Error('Doodle ID is required')
    }
    if (!data.email) {
        throw new Error('Email is required')
    }
    if (!validateEmail(data.email)) {
        throw new Error('Invalid email')
    }

    return new Promise((resolve, reject) => {
        communicate('ADD_PERMISSION', data)
        .then((resp) => {
            resolve(resp)
        })
        .catch((err) => {
            throw new Error(err.data.error)
        })
    })
}

export const deletePermission = async (data: deletePermissionsParam) => {

    if (!data.doodleId) {
        throw new Error('Doodle ID is required')
    }
    if (!data.email) {
        throw new Error('Email is required')
    }
    if (!validateEmail(data.email)) {
        throw new Error('Invalid email')
    }

    return communicate('DELETE_PERMISSION', data)
}

