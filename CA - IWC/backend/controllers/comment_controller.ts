import * as express from "express";
import { validateIds, validateNewComment } from "../middleware/validation_middleware";
import { authMiddleware } from "../middleware/auth_middleware";
import { getCommentRepository } from "../repositories/comment_repository";
import { getLinkRepository } from "../repositories/link_repository";

export function getCommentController() {

    // Prepare repositories
    const commentRepository = getCommentRepository();

    // Create router instance so we can declare endpoints
    const router = express.Router();

    // HTTP POST http://localhost:8080/api/v1/comments
    router.post("/", validateNewComment, authMiddleware, (req, res) => {
        (async () => {
            const newComment = req.body;
            // stores comment data after validation
            const validComment = (req as any).validNewComment;

            // If data is valid check if link exists
            if(validComment) {
                const linkData: any = await linkChecker(newComment.link, res);

                // If link exists create new comment and send response
                if(linkData) {
                    const commentData = await commentRepository.save(newComment);
                    res.status(201)
                        .json({
                            message: "Comment created",
                            data: commentData
                        });
                }
            } else {
                res.status(400)
                    .send({ message: "Invalid entries." });
            }
        })();
    });

    // HTTP PATCH http://localhost:8080/api/v1/comments/:id
    router.patch("/:id", validateIds, authMiddleware, (req, res) => {
        (async () => {
            const commentId: number = req.params.validId;
            const userId: number = req.body.user;
            const newComment: string = req.body.value;

            // Check if the comment is exists in the DB
            let commentToUpdate: any = await commentChecker(commentId, res);

            // If user that posted the comment is the same who is trying to update, proceed
            if(commentToUpdate.user.user_id == userId) {
                // delete user data from object
                delete commentToUpdate.user;
                // set new comment value
                commentToUpdate.value = newComment;
                const commentData = await commentRepository.save(commentToUpdate);
                res.status(200)
                    .json({
                        message: "Comment updated",
                        data: commentData
                    });
            } else {
                res.status(403)
                    .send({ message: `User id ${ userId } can't update this comment` });
            }
        })();
    });

    // HTTP DELETE http://localhost:8080/api/v1/comments/:id
    router.delete("/:id", validateIds, authMiddleware, (req, res) => {
        (async () => {
            const commentId: number = req.params.validId;
            const userId: number = req.body.user;

            // Check if the comment is exists in the DB
            const commentToRemove: any = await commentChecker(commentId, res);

            // If user that posted the comment is the same who is trying to delete, proceed
            if (commentToRemove.user.user_id == userId) {
                // delete user data from object
                delete commentToRemove.user;
                const deletedContent = await commentRepository.remove(commentToRemove);
                res.status(200)
                    .json({
                        message: "Comment deleted",
                        data: deletedContent
                    });
            } else {
                res.status(403)
                    .send({ message: `User id ${ userId } can't delete this comment` });
            }
        })();
    });

    return router;
}

async function linkChecker(linkId: number, res: any) {

    // Prepare link repository and fetch data
    const linkRepository = getLinkRepository();
    const linkExists = await linkRepository.findOne({ link_id:linkId });

    // Check if link is real
    if (linkExists) {
        return linkExists;
    } else {
        // When link not found
        res.status(404)
            .send({ message: `Link ID ${ linkId } not found.` });
    }
}

async function commentChecker(commentId: any, res: any) {

    // Prepare link repository and fetch data
    const commentRepository = getCommentRepository();
    const commentExists = await commentRepository.findOne({ comment_id: commentId}, { relations: ["user"] });

    // Check if link is real
    if (commentExists) {
        return commentExists;
    } else {
        // When link not found
        res.status(404)
            .send({ message: `Comment ID ${ commentId } not found.` });
    }
}