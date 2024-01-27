import { prisma } from "./_prisma_base";

export default async function saveProjectsAndBreaks(req, res) {
    const objects = req.body.objects1;

    for (const el of objects) {
        const idx = objects.indexOf(el)+1;

        if (el.type === "project") {
            await prisma.project.update({
                where: {
                    id: el.id
                },

                data: {
                    schedulePos: idx
                }
            });
        }

        if (el.type === "break") {
            await prisma.break.update({
                where: {
                    id: el.id
                },

                data: {
                    schedulePos: idx
                }
            });
        }
    }

    res.status(200).json({ ok: true })
}