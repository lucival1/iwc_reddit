import * as express from "express";
import { authMiddleware } from "../middleware/auth_middleware";
import { validateIds, validateNewLink } from "../middleware/validation_middleware";
import { getLinkRepository } from "../repositories/link_repository";
import { getCommentRepository } from "../repositories/comment_repository";
import { getVoteRepository } from "../repositories/vote_repository";
import { Repository } from "typeorm";
import { Link } from "../entities/link";

export function getLinkController() {

    // Prepare repositories
    const linkRepository = getLinkRepository();
    const commentRepository = getCommentRepository();
    const voteRepository = getVoteRepository();

    // Create router instance so we can declare endpoints
    const router = express.Router();

    // HTTP GET http://localhost:8080/api/v1/links
    router.get("/", (req, res) => {
        (async () => {
            // Get all the links available
            const links = await linkRepository.find();

            // If links exists return to client.
            if (links) {
                res.status(200)
                    .json(links);
            } else {
                res.status(404)
                    .json({ message: "No links found" });
            }
        })();
    });


    // HTTP GET http://localhost:8080/api/v1/links/:id
    router.get("/:id", validateIds, (req, res) => {
        (async () => {
            const linkId: number = req.params.validId;
            // Check if it is real and stores the link data
            const linkData = await linkChecker(linkId, res);

            // If link exists continue
            if (linkData) {
                // delete user data from object
                delete linkData.user;
                res.status(200)
                    .json(linkData);
            } else {
                res.status(404)
                    .json({ message: `Link id ${ linkId } not found` });
            }
        })();
    });


    // HTTP POST http://localhost:8080/api/v1/links
    router.post("/", validateNewLink, authMiddleware, (req, res) => {
        (async () => {
            const newLink = req.body;
            // Tell if the data sent is valid
            const validLink = (req as any).validNewLink;

            // If data is valid save new Link
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
                    .json({ message: "Invalid entries." });
            }
        })();
    });


    // HTTP DELETE http://localhost:8080/api/v1/links/:id
    router.delete("/:id", validateIds, authMiddleware, (req, res) => {
        (async () => {
            const linkId: number = req.params.validId;
            const userId: number = req.body.user;

            // Check if it is real and stores the link to data
            const linkToRemove: any = await linkChecker(linkId, res);

            // If user from client matches with link owner continue otherwise respond accordingly
            if (linkToRemove.user.user_id === userId) {
                // delete user data from object
                delete linkToRemove.user;
                const deletedContent = await linkRepository.remove(linkToRemove);
                res.status(200)
                    .json({
                        message: "Link deleted",
                        data: deletedContent
                    });
            } else {
                res.status(401)
                    .json({ message: `User id ${ userId } can't delete this link` });
            }
        })();
    });


    // HTTP POST http://localhost:8080/api/v1/links/:id/upvote
    router.post("/:id/upvote", validateIds, authMiddleware, (req, res) => {
        (async () => {
            const linkId: number = req.params.validId;
            const userId: number = req.body.user;

            // Check if it is real and stores the link to data
            const linkData: any = await linkChecker(linkId, res);
            // Stores the vote to be casted
            const voteToCast: any = await voteChecker(linkData.link_id, userId, res);

            // If voteToCast exists call the repository and send response
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
            const linkId: number = req.params.validId;
            const userId: number = req.body.user;

            // Check if it is real and stores the link to data
            const linkData: any = await linkChecker(linkId, res);
            // Stores the vote to be casted
            let voteToCast: any = await voteChecker(linkData.link_id, userId, res);

            // If voteToCast exists call the repository and send response
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


async function linkChecker(linkId: number, res: any) {

    // Prepare link repository and fetch data
    const linkRepository = getLinkRepository();
    const linkExists = await linkRepository.findOne(linkId, { relations: ["user", "comments"] });

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


async function voteChecker(linkId: any, userId: any, res: any) {

    // Prepare vote repository and fetch data
    const voteRepository = getVoteRepository();
    const voteExists = await voteRepository.findOne({ link_id: linkId, user: userId });

    // Check if user has voted the link before
    if (voteExists) {
        // When user has already voted
        res.status(400)
            .json({
                message: "User already has casted a vote.",
                data: voteExists
            })
            .send();

    } else {
        // Set new vote entity, default value is true, downvote route needs to be change to false
        const newVote: {
            user: number,
            link_id: number,
            value: boolean
        } = {
            user: userId,
            link_id: linkId,
            value: true
        };

        return newVote;
    }

}

export function getHandlers(linkRepository: Repository<Link>) {

    const httpPostLinkHandler = (
        req: express.Request,
        res: express.Response
    ) => {
        (async () => {
            const link = await linkRepository.save(req);
            res.json(link);
        })();
    };

    return { httpPostLinkHandler };
}