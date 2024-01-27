import {deleteCookie} from "cookies-next";


export default async function logout(req, res) {
    deleteCookie('auth_token', {req, res})
    console.log('ok')
    await res.status(200).json({
        status: 'ok'
    })
}