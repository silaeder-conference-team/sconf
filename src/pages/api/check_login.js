import jwt from 'jsonwebtoken';
import requestIp from 'request-ip';
import { getCookie } from 'cookies-next'
import { prisma } from "./_prisma_base";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const token = getCookie('auth_token', {req, res});
        const ip = requestIp.getClientIp(req);

        try {
            const token_result = JSON.parse(atob(token.split('.')[1]));

            if (ip === token_result.ip) {
                const user = await prisma.user.findMany({
                    where: {
                        id: token_result.user_id
                    }
                });

                if (user.length !== 0) {
                    try {
                        jwt.verify(token, user[0].password_hash);

                        res.status(200).json({
                            status: "ok",
                            user: user[0]
                        });
                    } catch (e) {
                        res.status(200).json({
                            status: "error"
                        });
                    }
                } else {
                    res.status(200).json({
                        status: "error"
                    });
                }
            } else {
                res.status(200).json({
                    status: "error"
                });
            }


        } catch (e) {
            res.status(200).json({
                status: "error"
            });
        }
    }
}