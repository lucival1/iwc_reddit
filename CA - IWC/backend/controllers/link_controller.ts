import * as express from "express";
import * as joi from "joi";
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
            if (linkId) {
                const linkData = await linkRepository.findOne(linkId);
                if (linkData) {
                    const userId = req.body.user_id;
                    if (linkData.user_id === userId) {
                        const linkRemoved = await linkRepository.delete(linkId);
                        res.status(200)
                            .json({
                                message: "Link deleted",
                                data: linkData
                            });
                    } else {
                        res.status(401)
                            .json({message: `User id ${ userId } can't delete this link`});
                    }
                } else {
                    res.status(404)
                        .json({message: `Link id ${ linkId } not found`});
                }
            }
        })();
    });

    // HTTP POST http://localhost:8080/api/v1/links/:id/upvote
    router.post("/:id/upvote", validateIds, authMiddleware, (req, res) => {
        (async () => {
            const linkId = req.params.validId;
            if (linkId) {
                const link = await linkRepository.findOne(linkId);
                const newVote = req.params.validId;
                const linkData = await voteRepository.save(newVote);
                res.json();
            } else {
                res.status(400).send({msg: "Movie is not valid!"});
            }
        })();
    });

    // HTTP POST http://localhost:8080/api/v1/links/:id/downvote
    router.post("/:id/downvote", authMiddleware, (req, res) => {
        (async () => {
            const newMovie = req.body;
            const result = joi.validate(req.body, linkDetailsSchema.newlink);
            if (result.error) {
                res.status(400).send({msg: "Movie is not valid!"});
            } else {
                const movies = await linkRepository.save(newMovie);
                res.json(movies);
            }
        })();
    });

    return router;
}