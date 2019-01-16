import * as express from "express";
import { validateIds, validateNewComment } from "../middleware/validation_middleware";
import { authMiddleware } from "../middleware/auth_middleware";
import { getCommentRepository } from "../repositories/comment_repository";
import { getLinkRepository } from "../repositories/link_repository";

export function getCommentController() {

    const commentRepository = getCommentRepository();
    const router = express.Router();

    // HTTP POST http://localhost:8080//api/v1/comments
    router.post("/", validateNewComment, authMiddleware, (req, res) => {
        (async () => {
            const newComment = req.body;
            // Tell if the data sent is valid
            const validComment = (req as any).validNewComment;

            // If data is valid check if link exists
            if(validComment) {
                const linkData: any = await linkChecker(newComment.link, res);

                // If link exists create new comment and send response
                if(linkData) {
                    const commentData = await commentRepository.save(newComment);
                    res.json({
                        message: "Comment created",
                        data: commentData
                    })
                    .send();
                }
            } else {
                res.status(400)
                    .json({ message: "Invalid entries." });
            }
        })();
    });

    return router;
}

async function linkChecker(linkId: number, res: any) {

    // Prepare link repository and fetch data
    const linkRepository = getLinkRepository();
    const linkExists = await linkRepository.findOne({link_id:linkId});

    // Check if link is real
    if (linkExists) {
        return linkExists;
    } else {
        // When link not found
        res.status(404)
            .json({ message: `Link ID ${ linkId } not found.` })
            .send();
    }
}