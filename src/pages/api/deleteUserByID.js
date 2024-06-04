import { prisma } from "./_prisma_base";

export default async function deleteUserByID(req, res) {
    const user_id = JSON.parse(req.body).id
    console.log(user_id)
    await prisma.user.update({
        where: {
            id: user_id
        },
        data: {
            isDeleted: true
        }
    })

    await res.status(200).json({ status: "ok" })
}