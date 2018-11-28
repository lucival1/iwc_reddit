import * as express from "express";
import {authMiddleware} from "../middleware/middleware";
import {validateIds, validateNewLink} from "../middleware/validation_middleware";
import {getLinkRepository} from "../repositories/link_repository";
import {getCommentRepository} from "../repositories/comment_repository";
import {getVoteRepository} from "../repositories/vote_repository";

export function getLinkController() {

    // Create respositories so we can perform database operations
    const linkRepository = getLinkRepository();
    const commentRepository = getCommentRepository();
    const voteRepository = getVoteRepository();

    // Create router instance so we can declare enpoints
    const router = express.Router();

    // HTTP GET http://localhost:8080/api/v1/links/
    router.get("/", (req, res) => {
        (async () => {
            const links = await linkRepository.find();
            // Get all comments and check if the data exists, send proper answer
            if (links) {
                res.status(200)
                    .json(links);
            } else {
                res.status(404)
                    .json({message: "No links found"});
            }
        })();
    });

    // HTTP GET http://localhost:8080/api/v1/links/:id
    router.get("/:id", validateIds, (req, res) => {
        (async () => {
            const linkId = req.params.validId;
            if (linkId) {
                // Find the link and respond accordingly
                const link = await linkRepository.findOne(linkId);
                if (link) {
                    // Get all the comments for the Link
                    const comments = await commentRepository.find({link_id: linkId});
                    // Create obj with link and comments
                    const response = {link, comments};
                    res.status(200)
                        .json(response);
                } else {
                    res.status(404)
                        .json({message: `Link id ${ linkId } not found`});
                }
            }
        })();
    });

    // HTTP POST http://localhost:8080/api/v1/links
    router.post("/", validateNewLink, authMiddleware, (req, res) => {
        (async () => {
            const newLink = req.body;
            // Tell is the data sent is valid
            const validLink = (req as any).validNewLink;
            // if data is valid posts new Link
            if (validLink) {
                const linkData = await linkRepository.save(newLink);
                res.status(200)
                    .json({
                        message: "Link posted",
                        data: linkData
                    })
                    .send();
            } else {
                res.status(400)
                    .json({message: "Invalid entries."});
            }
        })();
    });

    // HTTP DELETE http://localhost:8080/api/v1/links/:id
    router.delete("/:id", validateIds, authMiddleware, (req, res) => {
        (async () => {
            const linkId = req.params.validId;
            const userId = req.body.user_id;
            let linkData = await linkChecker(linkId, userId, res);
            if (linkData.user_id === userId) {
                await linkRepository.delete(linkId);
                res.status(200)
                    .json({
                        message: "Link deleted",
                        data: linkData
                    });
            } else {
                res.status(401)
                    .json({message: `User id ${ userId } can't delete this link`});
            }
        })();
    });

    // HTTP POST http://localhost:8080/api/v1/links/:id/upvote
    router.post("/:id/upvote", validateIds, authMiddleware, (req, res) => {
        (async () => {
            const linkId = req.params.validId;
            const userId = req.body.user_id;
            // Stores the vote to be casted
            let voteToCast = await voteChecker(linkId, userId, res);
            if (voteToCast) {
                const voteData = await voteRepository.save(voteToCast);
                res.status(200)
                    .json({
                        message: "Vote casted",
                        data: voteData
                    });
            }
        })();
    });

    // HTTP POST http://localhost:8080/api/v1/links/:id/downvote
    router.post("/:id/downvote", validateIds, authMiddleware, (req, res) => {
        (async () => {
            const linkId = req.params.validId;
            const userId = req.body.user_id;
            // Stores the vote to be casted
            let voteToCast = await voteChecker(linkId, userId, res);
            if (voteToCast) {
                // Default value is true so this needs to be reset to false on downvote
                voteToCast.value = false
                const voteData = await voteRepository.save(voteToCast);
                res.status(200)
                    .json({
                        message: "Vote casted",
                        data: voteData
                    });
            }
        })();
    });

    return router;
}

async function linkChecker(linkId: number, userId: number, res: any) {

    const linkRepository = getLinkRepository();

    const linkData = await linkRepository.findOne(linkId);
    if (linkData) {
        return linkData;
    } else {
        // When link not found
        res.status(404)
            .json({message: `Link ID ${linkId} not found.`})
            .send();
    }
}
async function voteChecker(linkId: number, userId: number, res: any) {

    // Create respositories so we can perform database operations
    const linkRepository = getLinkRepository();
    const voteRepository = getVoteRepository();

    const link = await linkRepository.findOne(linkId);
    if (link) {
        // Check if user has voted the link before
        const voteCheck = await voteRepository.findOne({link_id: linkId, user_id: userId});
        if (voteCheck) {
            // When user has already voted the link
            res.status(400)
                .json({
                    message: "User already has casted a vote.",
                    data: voteCheck
                })
                .send();
        } else {
            // Set new vote object, default value is true, needs to be changed to false for downvote route
            const newVote: {
                user_id: number,
                link_id: number,
                value: boolean
            } = {
                user_id: userId,
                link_id: link.link_id,
                value: true
            };

            // Returns the vote object
            return newVote;
        }
    } else {
        // When link not found
        res.status(404)
            .json({message: `Link ID ${linkId} not found.`})
            .send();
    }

}