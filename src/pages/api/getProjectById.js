import {getCookie} from "cookies-next";
import { prisma } from "./_prisma_base";

export default async function getProjectById(req, res) {
    const id = JSON.parse(req.body).id
    const jwt = getCookie('auth_token', { req, res })
    const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
    const all_projects = await prisma.project.findMany({
        include: {
            users: true
        }
    })

    const projects = []
    for (const project of all_projects) {
        // console.log(project.users[0].projectId, id, user_id)
        if ((project.id === id)) {
            const c_id = project.conferenceId
            const conference = await prisma.conference.findFirst({
                where: {
                    id: c_id
                }
            })
            project.conferenceId = { label: conference.name, value: conference.id }
            projects.push(project)
        }
    }
    await res.status(200).json({ project: projects[0] })
}