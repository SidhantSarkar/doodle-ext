
import { communicate } from "../content/utils/browserCommunication";

type getMyDoodleIdFromHashParam = [
    _key: string,
    items: {
        siteHash: string
    }
]

type getDoodleFromIdParam = [
    _key: string,
    items: {
        doodleId: string
    }
]

type getDoodleFromHashParam = [
    _key: string,
    items: {
        user: any,
        siteHash: string
    }
]

type newDoodleParam = {
    title: string,
    siteHash: string,
    data: any,
    siteUrl: string,
}

type updateDoodleParam = {
    doodleId: string,
    data: any,
}

type updateDoodleStateParam = {
    doodleId: string,
    isPublic?: boolean,
    title?: string,
}

type doodleData = {
    title: string,
    doodleId: string,
    author: any
}

export const getMyDoodleIdFromHash = async ({ queryKey }: { queryKey: getMyDoodleIdFromHashParam }): Promise<string> => {
    const [_key, { siteHash }] = queryKey
    
    if (!siteHash) {
        throw new Error('Hash is required')
    }

    return new Promise((resolve, reject) => {
        communicate('MY_DOODLE_ID_HASH', {siteHash})
        .then((resp) => {
            resolve(resp.data.id)
        }).catch((err) => {
            if (err.data.error === 'Not Found') {
                reject(err.data.error)
            } else {
                reject('')
            }
        })
    })
}

export const getDoodleFromId = async ({ queryKey }: { queryKey: getDoodleFromIdParam }): Promise<any> => {
    const [_key, { doodleId }] = queryKey
    
    if (!doodleId) {
        throw new Error('DoodleId is required')
    }

    return new Promise((resolve, reject) => {
        communicate('GET_DOODLE_ID', {doodleId})
        .then((resp) => {
            resolve(resp.data)
        })
        .catch((err) => {
            if (err.data.error === 'Not Found') {
                reject(err.data.error)
            } else {
                reject('')
            }
        })
    })
}

export const getDoodleFromHash = async ({ queryKey }: { queryKey: getDoodleFromHashParam }): Promise<{ myDoodles: doodleData[]; sharedDoodles: doodleData[]; publicDoodles: doodleData[]; }> => {
    const [_key, { siteHash, user }] = queryKey

    if (!siteHash) {
        throw new Error('Hash is required')
    } 

    if (!user) {
        throw new Error('Author is required')
    }

    return new Promise((resolve, reject) => {
        communicate('GET_DOODLE_HASH', { siteHash })
        .then((resp) => {
            const myDoodles: doodleData[] = []
            const sharedDoodles: doodleData[] = []
            const publicDoodles: doodleData[] = []
            if (resp.data.length <= 0 ) resolve({ myDoodles, sharedDoodles, publicDoodles })
            resp.data.forEach((doodle: any) => {
                if (doodle.author.email === user.email) {
                    myDoodles.push({
                        doodleId: doodle.id,
                        title: doodle.title,
                        author: doodle.author
                    })
                } else if (doodle.isPublic) {
                    publicDoodles.push({
                        doodleId: doodle.id,
                        title: doodle.title,
                        author: doodle.author
                    })
                } else {
                    doodle.permissions.forEach((permission: any) => {
                        if (permission.user.email === user.email) {
                            sharedDoodles.push({
                                doodleId: doodle.id,
                                title: doodle.title,
                                author: doodle.author
                            })
                        }
                    })
                }
            })
            resolve({ myDoodles, sharedDoodles, publicDoodles })
        })
        .catch((err) => {
            reject(err.data.error)
        })
    })
}

export const saveNewDoodle = async (data: newDoodleParam): Promise<any> => {

    if (!data.title) {
        throw new Error('Title is required')
    }

    if (!data.siteHash) {
        throw new Error('Site Hash is required')
    }

    if (!data.data) {
        throw new Error('No Data to save')
    }

    return new Promise((resolve, reject) => {
        communicate('SAVE_DOODLE', data)
        .then((resp) => {
            resolve(resp.data)
        })
        .catch((err) => {
            reject(err.data.error)
        })
    })
}

export const updateDoodle = async (data: updateDoodleParam) => {

    if (!data.doodleId) {
        throw new Error('Doodle ID is required')
    }

    if (!data.data) {
        throw new Error('No Data to update')
    }

    return communicate('UPDATE_DOODLE', data)
}

export const updateDoodleState = async (data: updateDoodleStateParam) => {

    if (!data.doodleId) {
        throw new Error('Doodle ID is required')
    }

    if (!data.title && (!data.isPublic && data.isPublic !== false)) {
        throw new Error('No Data to update')
    }

    return communicate('UPDATE_DOODLE_STATE', data);
}