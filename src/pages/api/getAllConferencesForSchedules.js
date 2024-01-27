import { prisma } from "./_prisma_base";

export default async function getAllConferencesForSchedules(req, res) {
    const conferences = await prisma.conference.findMany()
    const json = []
    conferences.forEach((e) => {
        json.push({ label: e.name, value: [e.id, e.start] })
    })
    
    res.status(200).json({ data: json.sort((a, b) => {return b.value[0] - a.value[0]}) })
}