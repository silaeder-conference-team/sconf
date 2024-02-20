import { prisma } from "./_prisma_base";

export default async function getSchedule(req, res) {
    const conference = await prisma.conference.findMany({
        where: {
            id: req.body.id
        },

        include: {
            project: true
        }
    })

    conference[0].project.sort((a, b) => {
        if (a.schedulePos < b.schedulePos) {
            return -1
        } else { return 1 }
    })

    const output = []

    for (const xy of conference[0].project) {
        let usrs = ""
        const x = await prisma.project.findUnique({
            where: {
                id: xy.id
            },
            include: {
                users: true
            }
        }).catch(
            usrs = ''
        )
        for (const hig2 of x.users) {
            const hig = await prisma.user.findUnique({
                where: {
                    id: hig2.userId
                }
            })
            usrs += hig.name + ", "
        }
        output.push({
            id: x.id,
            time: x.timeForSpeech.toString() + " мин.",
            participants: usrs + x.additionalUsers,
            name_of_project: x.name,
            hidden: x.isHidden
        })
    }

    res.status(200).json({ output: output })
}
