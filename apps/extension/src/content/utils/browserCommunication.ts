import browser from 'webextension-polyfill'

const allowedRequests = [ 
    'AUTH_CHECK', 
    'EXT_API_REQUEST', 
    'ROUTE_CHECK', 
    'SAVE_DOODLE', 
    'GET_DOODLE_ID',
    'MY_DOODLE_ID_HASH', 
    'GET_DOODLE_HASH',
    'UPDATE_DOODLE', 
    'UPDATE_DOODLE_STATE',
    'GET_PERMISSIONS', 
    'ADD_PERMISSION', 
    'DELETE_PERMISSION'
];

export const communicate = async (type: any, data = {}): Promise<{auth: boolean, status: boolean, data: any}>=> {
    // if (!allowedRequests.includes(type)) {
    //     throw new Error('Invalid request type');
    // }

    try {
        const resp = await browser.runtime.sendMessage({action: type, data});
        let auth = true;
        let status = true;
        if ('error' in resp) status = false;
        if ('error' in resp && resp.error === 'Unauthorized') auth = false;
        return new Promise((resolve, reject) => {
            if (status) {
                resolve({
                    auth,
                    status,
                    data: resp,
                })
            } else {
                reject({
                    auth,
                    status,
                    data: resp
                })
            }
        })
    } catch (error: any) {
        return new Promise((_, reject) => {
            reject({
                auth: true,
                status: false,
                data: error.message
            })
        })
    }

};