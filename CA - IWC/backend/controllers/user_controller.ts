import * as express from "express";
import { getUserRepository } from "../repositories/user_repository";
import { validateIds, validateNewUser } from "../middleware/validation_middleware";

export function getUserController() {

    // Prepare repositories
    const userRepository = getUserRepository();

    // Create router instance so we can declare endpoints
    const router = express.Router();

    // HTTP POST http://localhost:8080/api/v1/users
    router.post("/", validateNewUser, (req, res) => {
        (async () => {
            // After the validation stores new user data
            const newUser = req.body;
            // Check if user exists
            const userData = await userRepository.findOne( { email: newUser.email });

            // If user does not exists, create a new one
            if (!userData) {
                // Create new user
                const user = await userRepository.save(newUser);

                res.status(201)
                    .json({ userData: user });
            } else {
                res.status(400)
                    .send({ message: `Email ${ newUser.email } already in use.` });
            }
        })();
    });


    // HTTP GET http://localhost:8080/api/v1/users/:id
    router.get("/:id", validateIds, (req, res) => {
        (async () => {
            // Get valid ID from validation service
            const userId: number = req.params.validId;
            // Fetch user data
            const userData = await userRepository.findOne(userId, { relations: ["links", "comments"] });

            // If user is real, return all the related data
            if (userData) {
                res.status(200)
                    .json(userData);
            } else {
                res.status(404)
                    .send({ message: `User id ${ userId } not found.` });
            }
        })();
    });

    return router;
}