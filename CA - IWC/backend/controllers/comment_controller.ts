import * as express from "express";
import { getCommentRepository } from "../repositories/comment_repository";
import * as joi from "joi";

export function getCommentController() {

    const commentRepository = getCommentRepository();
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
                res.status(400).send();
            } else {
                const match = await commentRepository.findOne(userDetails);
                res.json({ ok: "ok" }).send();
            }
        })();
    });

    return router;
}