import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import * as joi from "joi";

export function getUserController() {

    const userRepository = getUserRepository();
    const router = express.Router();

    // userDetailsSchema can store different schemas
    const userDetailsSchema = {
        userId: {
            id: joi.number()
        },
        newUser: {
            email: joi.string().email(),
            password: joi.string()
        }
    };

    // HTTP POST http://localhost:8080/api/v1/users/
    router.post("/", (req, res) => {
        (async () => {
            const newUser = req.body;
            const result = joi.validate(newUser, userDetailsSchema.newUser);
            if (result.error) {
                res.status(400)
                    .json({ message: `Invalid entry.` })
                    .send();
            } else {
                const userEmail = req.body.email;
                const userData = await userRepository.findOne( { email: userEmail });
                if (userData) {
                    res.status(400)
                        .json({ message: `Email ${ userEmail } already in use.` })
                        .send();
                } else {
                    const user = await userRepository.save(newUser);
                    res.status(200)
                        .json({ user: user })
                        .send();
                }
            }
        })();
    });

    // HTTP GET http://localhost:8080/api/v1/users/:id
    router.get("/:userId", (req, res) => {
        (async () => {
            const userId = req.params.userId;
            const result = joi.validate(userId, userDetailsSchema.userId.id);
            if (result.error) {
                res.status(400)
                    .json({ message: `Invalid entry.`, error: result.error })
                    .send();
            } else {
                const userData = await userRepository.findOne(userId);
                if (userData) {
                    res.status(200)
                        .json(userData);
                } else {
                    res.status(404)
                        .json({ message: `User id ${ userId } not found.` })
                        .send();
                }
            }
        })();
    });

    return router;
}