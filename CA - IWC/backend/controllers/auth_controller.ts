import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";
import jwt from "jsonwebtoken";

export function getAuthController() {

    const AUTH_SECRET = "123";//process.env.AUTH_SECRET;
    const userRepository = getUserRepository();
    const router = express.Router();

    const userDetailsSchema = {
        email: joi.string().email(),
        password: joi.string()
    };

    // HTTP POST http://localhost:8080//api/v1/auth/login/
    router.post("/login", (req, res) => {
        (async () => {
            console.log('auth', req.body);
            const userDetails = req.body;
            const result = joi.validate(userDetails, userDetailsSchema);
            if (result.error) {
                console.log('auth', 400);
                res.status(400).send();
            } else {
                const match = await userRepository.findOne(userDetails);
                if (match === undefined) {
                    console.log('auth', 401);
                    res.status(401).send();
                } else {
                    if (AUTH_SECRET === undefined) {
                        res.status(500).send();
                    } else {
                        const token = jwt.sign({ id: match.user_id }, AUTH_SECRET);
                        res.json({ token: token }).send();
                    }
                }
            }
        })();
    });

    return router;
}