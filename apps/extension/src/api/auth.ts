import { communicate } from "../content/utils/browserCommunication";

type authCheckParam = [
    _key: string,
]

export const authCheck = async ({ queryKey }: { queryKey: authCheckParam }) => {
    const [ _key ] = queryKey;

    return new Promise((resolve, reject) => {
        communicate('AUTH_CHECK')
            .then((resp) => {
                resolve(resp.data.user)
            })
            .catch((err) => {
                console.log('err', err)
                reject(err)
            })
    })
}