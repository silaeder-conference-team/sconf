import { prisma } from "./_prisma_base";

export default async function getAllConferences(req, res) {
    const users = await prisma.conference.findMany()
    const json = []
    console.log(e.start.getTime())
    users.forEach((e) => {
        if (e.start.getFullYear() > 2000) {
            json.push({label: e.name, value: [e.id, e.start]})
        }
    })

    res.status(200).json({ data: json })
}