import { prisma } from "./_prisma_base";

export default async function getConferenceById(req, res) {
    const id = JSON.parse(req.body).id
    const conference = await prisma.conference.findUnique({
        where: {
            id: id
        }
    })

    await res.status(200).json({ conference: conference })
}