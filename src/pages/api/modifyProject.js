import { prisma } from "./_prisma_base";
import { getCookie } from "cookies-next";

export default async function CreateProject(req, res) {
    if (req.method === "POST") {
        const { name, description, time_for_speech, grade, section, conference_id, members, tutor_id } = req.body
        try {
        const jwt = getCookie('auth_token', { req, res })
        const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
        if (members == undefined || tutor_id == undefined || conference_id == undefined || section == undefined) {
            throw TypeError;
        }
        const conference = await prisma.conference.findMany({
            where: {
                id: parseInt(conference_id)
            }
        });
        const breaks = await prisma.break.findMany({
            where: {
                conferenceId: conference_id
            }
        });
        const projects = await prisma.project.findMany({
            where: {
                conferenceId: conference_id
            }
        })
        let schedule_pos = breaks.length + projects.length + 1;

        let all_users = await prisma.user.findMany({});


        await prisma.projectsOnUsers.deleteMany({
            where: { projectId: req.body.project_id,
                    userId: { in: all_users.map((user) => user.id) } },
        });

        if (!members.includes(user_id)) {
            members.push(user_id);
        }
        await prisma.project.update({
            where: {
                id: req.body.project_id,
            },
            data: {
                schedulePos: schedule_pos,
                name: name,
                description: description,
                section: section,
                timeForSpeech: time_for_speech,
                grade: grade,
                active: true,
                tutor: {connect: { id: tutor_id }},
                additionalUsers: req.body.additional_users,
                Conference: {
                    connect: {
                        id: conference[0].id,
                    }
                },
            },
        });

        members.forEach(async (member) => {
            await prisma.projectsOnUsers.create({
                data: {
                userId: member,
                projectId: req.body.project_id,
                }
            })
        });
    } catch {
        console.log('Форма не заполнена')
    }
        

        return res.status(200).json({ success: true })
    }
}
