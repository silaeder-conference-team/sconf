import bcrypt from "bcrypt";
import { prisma } from "./_prisma_base";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {email, stage} = JSON.parse(req.body);

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (user !== undefined) {
            if (stage !== undefined) {
                prisma.user.update({
                    data: {
                        password_hash: bcrypt.hash(stage, bcrypt.genSalt(10))
                    },
                    where: {
                        email: email
                    }
                })
            } else {
                const code = getRandomInt(1000, 9999);

                return res.status(200).json({code: code, name: user.name});
            }
        } else {
            return res.status(200).json({error: "not found"});
        }
    }
}