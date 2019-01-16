import * as express from "express";
import { getCommentRepository } from "../repositories/comment_repository";
import { validateIds, validateNewComment } from "../middleware/validation_middleware";
import { authMiddleware } from "../middleware/auth_middleware";

export function getCommentController() {

    const commentRepository = getCommentRepository();
    const router = express.Router();

    // HTTP POST http://localhost:8080//api/v1/comments
    router.post("/", validateNewComment, authMiddleware, (req, res) => {
        (async () => {
            const newComment = req.body;
            // Tell if the data sent is valid
            const validComment = (req as any).validNewComment;

            /* TODO check link id before create comment */

            // If data is valid save new Comment
            if(validComment) {
                const commentData = await commentRepository.save(newComment);
                res.json({
                        message: "Comment created",
                        data: commentData
                    })
                    .send();
            } else {
                res.status(400)
                    .json({ message: "Invalid entries." });
            }
        })();
    });

    return router;
}