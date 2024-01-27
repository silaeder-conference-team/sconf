import { prisma } from "./_prisma_base";

export default async function addBreak(req, res) {
    const body = JSON.parse(req.body)
    const time = body.time;
    const conference_id = body.conference_id;
    const schedule_pos = body.schedule_pos;

    const conference = await prisma.conference.findMany({
        where: {
            id: conference_id
        },

        include: {
            project: true,
            break: true
        }
    })

    const projects = conference[0].project;
    const breaks = conference[0].break;

    let a = true;

    for (const el of projects) {
        if (el.schedulePos === schedule_pos) {
            await prisma.project.update({
                where: {
                    id: el.id
                },

                data: {
                    schedulePos: el.schedulePos+1
                }
            })

            a = false;

            break;
        }
    }

    if (a) {
        for (const el of breaks) {
            if (el.schedulePos === schedule_pos) {
                await prisma.break.update({
                    where: {
                        id: el.id
                    },
    
                    data: {
                        schedulePos: el.schedulePos+1
                    }
                })
    
                a = false;
    
                break;
            }
        }
    }

    

    await prisma.break.create({
        data: {
            time: time,
            conferenceId: conference_id,
            schedulePos: schedule_pos
        }
    });

    let i = schedule_pos + 1;
    while (true) {
        let can_continue = false;

        for (const el of projects) {
            if (el.schedulePos === i) {
                await prisma.project.update({
                    where: {
                        id: el.id
                    },

                    data: {
                        schedulePos: el.schedulePos+1
                    }
                })

                can_continue = true;
                break;
            }
        }

        if (!can_continue) {
            for (const el of breaks) {
                if (el.schedulePos === i) {
                    can_continue = true

                    await prisma.break.update({
                        where: {
                            id: el.id
                        },

                        data: {
                            schedulePos: el.schedulePos+1
                        }
                    })

                    break;
                }
            }
        }

        if (!can_continue) {
            break;
        }
    }

    res.status(200).json({ ok: true })
}