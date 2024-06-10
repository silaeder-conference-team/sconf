import { prisma } from "./_prisma_base";
import {getCookie} from "cookies-next";

export default async function deleteUserByID(req, res) {
    const jwt = getCookie('auth_token', { req, res })
    const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
    const project_id = JSON.parse(req.body).id
    try {
        await prisma.projectsOnUsers.delete({
            where: {
                projectId_userId: {
                    projectId: project_id,
                    userId: user_id
                }
            }
        })
    } catch (e) {
        
    }
    try {
        await prisma.project.delete({
            where: {
                id: project_id
            }
        })
    } catch (e) {
        
    }
    await res.status(200).json({ status: "ok" })
}