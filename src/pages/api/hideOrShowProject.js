import { prisma } from "./_prisma_base";

export default async function hideOrShowProject(req, res) {
    const project_id = req.body.id;

    const project = await prisma.project.findMany({
        where: {
            id: project_id
        }
    });


    await prisma.project.update({
        where: {
            id: project_id
        },

        data: {
            isHidden: !project[0].isHidden
        }
    });

    res.status(200).json({ ok: true })
}