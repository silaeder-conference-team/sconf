import { prisma } from "./_prisma_base";

export default async function getProjectsByConferenceID(req, res) {
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

    res.status(200).json({ projects: conference[0].project })
}
