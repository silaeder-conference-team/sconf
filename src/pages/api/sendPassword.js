import MD5 from "crypto-js/md5";
import { setCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import requestIp from "request-ip";
import { prisma } from "./_prisma_base";


export default async function handler(req, res) {
    if (req.method === "POST") {
        const {email, password} = JSON.parse(req.body);

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (user !== undefined) {
            if (password !== undefined) {
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        password_hash: MD5(password).toString()
                    },
                })
                const ip = requestIp.getClientIp(req);
                const token = jwt.sign({ip: ip, user_id: user.id, auth_token: true}, MD5(password).toString());
                setCookie('auth_token', token, { req, res })
                
                res.status(200).json({
                    token: token
                })
            }
        } else {
            return res.status(200).json({error: "not found"});
        }
    }
}