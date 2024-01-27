import { prisma } from "./_prisma_base";
import {getCookie} from "cookies-next";


export default async function createEmptyProject(req, res) {
    if (req.method === 'POST') {
        
        const jwt = getCookie('auth_token', { req, res });
        const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id;
        // try {
            const project = await prisma.project.create({
                data: {
                    name: '',
                    description: '',
                    section: '',
                    timeForSpeech: 5,
                    schedulePos: 0,
                    active: true,
                    grade: 0,
                    isHidden: false,
                    additionalUsers: '',
                    
                }
            })
            console.log(project.id);
            await prisma.projectsOnUsers.create({
                data: {
                    userId: user_id,
                    projectId: project.id,
                }
            });
            await res.status(200).json({project_id: project.id});
        // } catch (e) {
        //     res.status(200).json({
        //         status: 'error'
        //     })
        // }
    }
}