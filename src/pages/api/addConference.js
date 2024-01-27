import { prisma } from "./_prisma_base";

export default async function addConference(req, res) {
    const { name, dateTime } = req.body;

    await prisma.conference.create({
        data: {
            name: name,
            start: new Date(dateTime).toISOString()
        }
    });

    res.status(200).json({ ok: true });
}
