import { prisma } from "./_prisma_base";

async function getTimeOfProjectStart(conference_id, schedule_pos) {
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

    let time = 0;

    for (let i = 0; i < schedule_pos; i++) {
        projects.forEach((el) => {
            if (el.schedulePos === i && !el.isHidden) {
                time += el.timeForSpeech
            }
        });

        breaks.forEach((el) => {
            if (el.schedulePos === i) {
                time += el.time
            }
        })
    }

    const startTime = new Date(conference[0].start);

    startTime.setMinutes(startTime.getMinutes()+time);

    if (String(startTime.getMinutes()).length === 1) {
        return startTime.getHours()+":0"+startTime.getMinutes();
    } else {
        return startTime.getHours()+":"+startTime.getMinutes();
    }
}

async function getParticipantsOfProjectByID(id) {
    const project = await prisma.project.findMany({
        where: {
            id: id
        },

        include: {
            users: true
        }
    });

    const users = project[0].users;
    let output = "";

    for (let i = 0; i < users.length; i++) {
        const user = await prisma.user.findMany({
            where: {
                id: users[i].userId
            }
        });

        if (output === "") {
            output = user[0].name
        } else {
            output += ", " + user[0].name
        }
    }

    return output;
}

async function getProjectStateByID(id) {
    const project = await prisma.project.findMany({
        where: {
            id: id
        }
    })

    return project[0].isHidden
}

export default async function getScheduleForConferenceID(req, res) {
    const { id } = req.body;

    let i = 1;

    let output = [];

    let run = true;
    

    while (run) {

        const data = await prisma.project.findMany({
            where: {
                conferenceId: id,
                schedulePos: i
            }
        });
        
        
        if (data.length === 0) {
            const data1 = await prisma.break.findMany({
                where: {
                    conferenceId: id,
                    schedulePos: i,
                }
            });
            if (data1.length === 0) {
                run = false;
                
            } else {
                const data4 = await getTimeOfProjectStart(id, i);

                output.push({
                    id: data1[0].id,
                    time: data4,
                    participants: "Все",
                    name_of_project: "Перерыв",
                    hidden: false
                })
            }
        } else {
            const data2 = await getTimeOfProjectStart(id, i);
            const data3 = await getParticipantsOfProjectByID(data[0].id);
            const data5 = await getProjectStateByID(data[0].id);

            output.push({
                id: data[0].id,
                time: data5 ? '' : data2,
                participants: data3,
                name_of_project: data[0].name,
                hidden: data5
            })
        }

        i++;
    }

    res.status(200).json({output: output})
}