import { prisma } from "./_prisma_base";

export default async function getProjectUsers(req, res) {
    const id = JSON.parse(req.body).id
    const project = await prisma.project.findUnique({
	where: {
		id: id
	},
	include: {
            users: true
        }
    })
    const users = []
    for (const user of project.users) {
	let useri = await prisma.user.findUnique({
		where: {
			id: user.userId
		}
	})
	users.push(useri.name)
    }
await res.status(200).json({ users: users })
}
