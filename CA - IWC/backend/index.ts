import { getApp } from "./config/app";

(async () => {

    const app = await getApp();

    // Start the server
    app.listen(8080, () => {
        console.log(
            "The server is running in port 8080!"
        );
    });

})();