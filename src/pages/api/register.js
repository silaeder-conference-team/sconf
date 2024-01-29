import jwt from 'jsonwebtoken';
import requestIp from 'request-ip';
import {setCookie} from "cookies-next";
import { prisma } from "./_prisma_base";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const {name, email, password_hash, captureResponse} = JSON.parse(req.body);
        const ip = requestIp.getClientIp(req);


        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SERVER_TOKEN,
                response: captureResponse
            })
        })
        const json_response = await response.json();
        if (!json_response.success) {
            res.status(200).json({
                error: "recaptcha failed"
            });
        }

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password_hash: password_hash,
                isOrganisator: false,
                isStudent: true,
                isTutor: false
            }
        })
        console.log(user.id)
        const token = jwt.sign({ip: ip, user_id: user.id}, password_hash);
        setCookie('auth_token', token, { req, res })

        res.status(200).json({
            token: token
        });

    }
}