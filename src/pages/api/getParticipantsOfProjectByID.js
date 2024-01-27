import { prisma } from "./_prisma_base";

export default async function getParticipantsOfProjectByID(req, res) {
    const project = await prisma.project.findMany({
        where: {
            id: req.body.id
        },

        include: {
            users: true
        }
    });

    let output;

    for (let el in project[0].users) {
        const user = await prisma.user.findMany({
            where: {
                id: el.userID
            }
        });

        user.forEach((el1) => {
            if (output === undefined) {
                output = el1.name
            } else {
                output += " " + el1.name
            }
        })
    }

    res.status(200).json({ output: output })
}