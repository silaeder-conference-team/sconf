import { prisma } from "./_prisma_base";

export default async function getShowingProjects(req, res) {
    const projects = await prisma.project.findMany({
        where: {
            isInShowerCase: true
        }
    })
    res.status(200).json({ data: projects })
}
