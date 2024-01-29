import jwt from 'jsonwebtoken';
import requestIp from 'request-ip';
import {setCookie} from "cookies-next";
import { prisma } from "./_prisma_base";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {email, password_hash, captureResponse} = JSON.parse(req.body);
        const ip = requestIp.getClientIp(req);

        const user = await prisma.user.findMany({
            where: {
                email: email,
                password_hash: password_hash
            }
        });

        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SERVER_TOKEN,
                response: captureResponse
            })
        })
        const json_response = await response.json();

        if ((user.length !== 0) && (user[0].password_hash === password_hash) && (json_response.success)) {
            const token = jwt.sign({ip: ip, user_id: user[0].id}, password_hash);
            setCookie('auth_token', token, { req, res })

            res.status(200).json({
                token: token
            });
        } else {
            res.status(200).json({
                error: "you are hig podlenec stop trying to break sconf it is not possible"
            });
        }
    }
}