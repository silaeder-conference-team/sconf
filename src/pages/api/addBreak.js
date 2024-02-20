import { prisma } from "./_prisma_base";

export default async function addBreak(req, res) {
    const body = JSON.parse(req.body)
    const time = body.time;
    const conference_id = body.conference_id;
    await prisma.project.create({
        data: {
            name: 'Перерыв',
            description: '',
            section: '',
            timeForSpeech: time,
            schedulePos: 0,
            active: true,
            grade: 0,
            isHidden: false,
            additionalUsers: '',
            Conference: {
                connect: {
                    id: conference_id,
                }
            }
        }
    })

    res.status(200).json({ ok: true })
}