import {getCookie} from "cookies-next";
import { prisma } from "./_prisma_base";

export default async function getConferenceById(req, res) {
    const jwt = getCookie('auth_token', { req, res })
    const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
    const user = await prisma.user.findUnique({
        where: {
            id: Number(user_id)
        }
    })

    await res.status(200).json({ user: user })
}