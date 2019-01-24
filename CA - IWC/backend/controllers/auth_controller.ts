import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";
import jwt from "jsonwebtoken";

export function getAuthController() {

    // AUTH_SECRET must come from the environment variables
    const AUTH_SECRET = process.env.AUTH_SECRET;

    // Prepare repositories
    const userRepository = getUserRepository();

    // Create router instance so we can declare endpoints
    const router = express.Router();

    const userDetailsSchema = {
        email: joi.string().email(),
        password: joi.string()
    };

    // HTTP POST http://localhost:8080//api/v1/auth/login/
    router.post("/login", (req, res) => {
        (async () => {
            const userDetails = req.body;
            const result = joi.validate(userDetails, userDetailsSchema);
            if (result.error) {
                res.status(400).send({ message: 'Invalid user details'});
            } else {
                const match = await userRepository.findOne(userDetails);
                if (match === undefined) {
                    res.status(401).send({ message: 'Unauthorized Access'});
                } else {
                    if (AUTH_SECRET === undefined) {
                        res.status(500).send({ message: 'Internal Server error' });
                    } else {
                        const token = jwt.sign({ id: match.user_id }, AUTH_SECRET);
                        res.json({ token: token });
                    }
                }
            }
        })();
    });

    return router;
}