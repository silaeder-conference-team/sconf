import { getCookie } from "cookies-next";
import { prisma } from "./_prisma_base";

export default async function getUserProjects(req, res) {
    if (req.method === "GET") {
        const jwt = getCookie('auth_token', { req, res })
        const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
        const all_projects = await prisma.project.findMany({
            include: {
                users: true
            }
        })
        const projects = []
        all_projects.forEach((project) => {
            project.users.forEach((user, index) => {
                if (project.users[index].userId === user_id) {
                    projects.push(project)
                }
            })
        })
        await res.status(200).json({ projects: projects })
    }
}
