import * as express from "express";
import * as joi from "joi";

export function validateIds(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {

    // Defines id requirements when a parameter is passed trough url
    const idDetailsSchema = {
        idFormat: joi.number()
    };
    const idToCheck = req.params.id;
    const result = joi.validate(idToCheck, idDetailsSchema.idFormat);

    // If the id has a valid format calls next otherwise sends 400
    if (result.error) {
        res.status(400)
            .json({message: `Invalid ID.`, error: result.error})
            .send();
    } else {
        (req as any).params.validId = idToCheck;
        next();
    }
}

export function validateNewUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    // defines newLink requirements
    const newUserSchema = {
        email: joi.string().email(),
        password: joi.string()
    };
    const newUser = req.body;

    // check if title and url params are defined datatype
    if (newUser.email != undefined && newUser.password != undefined) {
        const result = joi.validate(newUser, newUserSchema);

        // If the Params are valid call next otherwise sends status 400
        if (result.error) {
            res.status(400)
                .json({message: 'Invalid entries.'})
                .send();
        } else {
            next();
        }
    } else {
        res.status(400)
            .json({message: "Invalid entries."});
    }

}

export function validateNewLink(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    // defines newLink requirements
    const newLinkSchema = {
        title: joi.string(),
        url: joi.string()
    };
    const newLink = req.body;

    // check if title and url params are defined datatype
    if (newLink.title != undefined && newLink.url != undefined) {
        const result = joi.validate(newLink, newLinkSchema);

        // If the Params are valid call next otherwise sends status 400
        if (result.error) {
            res.status(400)
                .json({message: 'Invalid entries.'})
                .send();
        } else {
            (req as any).validNewLink = true;
            next();
        }
    } else {
        res.status(400)
            .json({message: "Invalid entries."});
    }

}
export function validateNewComment(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    // defines newLink requirements
    const newCommentSchema = {
        value: joi.string(),
        link: joi.number()
    };
    const newComment = req.body;

    // check if title and url params are defined datatype
    if (newComment.value != undefined && newComment.link != undefined) {
        const result = joi.validate(newComment, newCommentSchema);

        // If the Params are valid call next otherwise sends status 400
        if (result.error) {
            res.status(400)
                .json({message: 'Invalid entries.'})
                .send();
        } else {
            (req as any).validNewComment = true;
            next();
        }
    } else {
        res.status(400)
            .json({message: "Invalid entries."});
    }

}