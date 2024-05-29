import { prisma } from "./_prisma_base";

export default async function getAllUsers(req, res) {
    const projects = await prisma.project.findMany()
    const json = []
    projects.forEach((e) => {
        if (e.name !== "Перерыв") {
            json.push({label: e.name, value: e.id})
        }
    })

    res.status(200).json({ data: json })
}
