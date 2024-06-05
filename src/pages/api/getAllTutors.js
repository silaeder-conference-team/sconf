import { prisma } from "./_prisma_base";

export default async function getAllUsers(req, res) {
    const users = await prisma.user.findMany({
        where: {
            isDeleted: false
        }
    })
    const json = []
    users.forEach((e) => {
        if (e.isTutor) {
            json.push({label: e.name, value: e.id})
        }
    })
    res.status(200).json({ data: json })
}