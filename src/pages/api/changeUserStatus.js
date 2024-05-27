import { prisma } from "./_prisma_base";
import { getCookie } from "cookies-next";

export default async function ChangeUserStatus(req, res) {
    if (req.method === "POST") {
        const { isOrg, isTut, isSt, id } = JSON.parse(req.body)
        try {
            await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    isTutor: isTut,
                    isOrganisator: isOrg,
                    isStudent: isSt
                },
            });

        } catch {
            console.log('Форма не заполнена')
        }


        return res.status(200).json({ success: true })
    }
}
