import {prisma} from "@/pages/api/_prisma_base";

export default async function MoveProjectToShowcase(req, res) {
    if (req.method === "POST") {
        const id = JSON.parse(req.body).id
        await prisma.project.update({
            where: {
                id: id,
            },
            data: {
                isInShowerCase: false
            },
        });
        return res.status(200).json({ success: true })
    }
}
