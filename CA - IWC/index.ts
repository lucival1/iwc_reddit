import express from "express";
import bodyParser from "body-parser";
import { createDbConnection } from "./db";
import { getAuthController } from "./backend/controllers/auth_controller";
import { getCommentController } from "./backend/controllers/comment_controller";
import { getLinkController } from "./backend/controllers/link_controller";
import { getUserController } from "./backend/controllers/user_controller";


(async () => {

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

    // Start the server
    app.listen(8080, () => {
        console.log(
            "The server is running in port 8080!"
        );
    });

})();