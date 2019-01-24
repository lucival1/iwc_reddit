import express from "express";
import bodyParser from "body-parser";
import { createDbConnection } from "./db";
import { getAuthController } from "../controllers/auth_controller";
import { getCommentController } from "../controllers/comment_controller";
import { getLinkController } from "../controllers/link_controller";
import { getUserController } from "../controllers/user_controller";


export async function getApp(useFakeDabe = false) {

    // load environment variable from .env file
    require('dotenv').config();
    // Create db connection
    await createDbConnection();

    // Creates app
    const app = express();

    // Server config to be able to send JSON
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Declare main path
    app.get("/", (req, res) => {
        res.send("This is the home page!");
    });

    // Declare controllers
    const authController = getAuthController();
    const commentsController = getCommentController();
    const linksController = getLinkController();
    const usersController = getUserController();
    app.use("/api/v1/auth", authController);
    app.use("/api/v1/comments", commentsController);
    app.use("/api/v1/links", linksController);
    app.use("/api/v1/users", usersController);

    return app;

};