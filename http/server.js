import https from "https";
import fs from "fs";
import url from "url";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import { createNewRecipe } from "../Recipe/recipe.js"
import { createUser, loginUser, updateUser } from "../usersystem/userHandler.js";
import { 
    getRecipes, 
    getRecipeById, 
    checkUser, 
    updateFavorite,
    getFavorites
} from "../database/databaseHandler.js";
import { extractData } from "./inputValidation.js";

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDirectoryPath = path.join(__dirname, "public");

// Load SSL certificates
const options = {
    key: fs.readFileSync(process.env.KEYURL),
    cert: fs.readFileSync(process.env.CERTURL)
};

const server = https.createServer(options, async (req, res) =>{
    let method = req.method;
    let _url = req.url.split("?")[0];
    let formData = "";
    switch (method) {
        case "GET": // Read
        let result;
        let data;
            switch (_url) {
                case "/loginUser":
                    console.log(req.url.split("?")[1]);
                    result = await loginUser(req.url.split("?")[1]);

                    if (result !== "invalidEmail" && result !== "wrongPassword") { // Success
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(result));
                    } else { // Error
                        res.writeHead(400, { "Content-Type": "text/plain" });
                        res.end(JSON.stringify(result));
                    }
                    break;
                case "/getUser":
                    data = extractData(req.url.split("?")[1])
                    data["email"] = decodeURIComponent(data["email"]);
                    data["email"]  = data["email"] .toLowerCase();
                    let user = await checkUser(data.email);

                    result = {
                        fName: user.fName,
                        lName: user.lName,
                        email: user.email,
                        favorites: user.favorites,
                        privileges: user.privileges
                    }

                    if (typeof result === "object") {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(result));
                    } else {
                        res.writeHead(400, { "Content-Type": "text/plain" });
                        res.end(JSON.stringify("userNotFound"));
                    }
                    break;
                case "/getRecipes":
                    result = await getRecipes();

                    if (result) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(result));
                    } else {
                        res.writeHead(400, { "Content-Type": "text/plain" });
                        res.end(JSON.stringify("noRecipesFound"));
                    }
                    break;
                case "/getRecipe":
                    data = extractData(req.url.split("?")[1]);
                    result = await getRecipeById(data.id);

                    if (result) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(result));
                    } else {
                        res.writeHead(400, { "Content-Type": "text/plain" });
                        res.end(JSON.stringify("noRecipesFound"));
                    }
                    break;
                case "/getFavorites":
                    data = extractData(req.url.split("?")[1]);
                    result = await getFavorites(data.userToken);

                    if (result.length >= 1) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify(result));
                    } else {
                        res.writeHead(400, { "Content-Type": "text/plain" });
                        res.end(JSON.stringify("noRecipesFound"));
                    }
                    break;
                default: // On first entry gives the landing page, else it gives the requested page
                    req.url = req.url.split("?")[0];
                    const filePath = path.join(publicDirectoryPath, path.normalize(req.url === "/" ? "/html/index.html" : req.url));
                    const extname = path.extname(filePath);
                    let contentType = "text/html";
                    // Gets the extension name e.g. ".js"
                    contentType = getContentType(extname);
                    fs.readFile(filePath, async (err, content) => {
                        if (err) {
                            // Responds with error if there is any
                            if (err.code === "ENOENT") {
                                res.writeHead(404); // This can be changed to go to the landing page
                                res.end(`File not found: ${req.url}`);
                            } else {
                                res.writeHead(500);
                                res.end(`Server error: ${err.code}`);
                            }
                        } else { // Responds with the request content
                            //console.log(contentType); // For debugging  received content types
                            res.writeHead(200, { "contentType": contentType });
                            res.end(content, "utf-8");
                        }
                    });
                    break;
            }
            break;
        case "POST": // Create
        switch (_url) {
            case "/submitForm":
                    formData = "";
                    req.on("data", chunk => {
                        formData += chunk.toString();
                    });
                    req.on("end", () => {
                        // Process the form data
                        const result = createNewRecipe(formData);

                        if (Array.isArray(result) && result.length > 0) {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify(result));
                        } else {
                            // Redirect the user to a success page
                            res.writeHead(200, { "Content-Type": "text/plain" });
                            res.end("/");
                        }
                    });
                    break;
                case "/createUser":
                    formData = "";
                    req.on("data", chunk => {
                        formData += chunk.toString();
                    });
                    req.on("end", async () => {
                        // Process the form data
                        const result = await createUser(formData);

                        if (result) { // Success
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify(result));
                        } else { // Error
                            res.writeHead(400, { "Content-Type": "text/plain" });
                            res.end(JSON.stringify(result));
                        }
                    });
                    break;
            }
            break;
        case "PATCH": // Update
            
            break;
        case "DELETE": // DELETE
            
            break;
        case "PUT": // Update/Replace
            switch (_url) {
                case "/updateUser":
                    formData = "";
                    req.on("data", chunk => {
                        formData += chunk.toString();
                    });
                    req.on("end", async () => {
                        let result = await updateUser(formData);
                        
                        if (result = true) { // Success
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify("Succesfully updated user"));
                        } else { // Error
                            res.writeHead(400, { "Content-Type": "text/plain" });
                            res.end(JSON.stringify(result));
                        }
                    });
                    break;
                case "/updateFavorites":
                    let body = "";

                    req.on("data", (chunk) => {
                        body += chunk.toString();
                        body = JSON.parse(body);
                    });
                    req.on("end", async () => {
                        await updateFavorite(body.userToken, body.recipeId)
                    });
                    break;
            }
        default: // Unknown method type
            res.statusCode = 405;
            res.setHeader("Allow", "GET, POST, PATCH, DELETE, PUT");
            res.end("Method not allowed");
            break;
    }
});

// This returns the http doctype based on the provided extension name e.g. ".html" = text/html
function getContentType(extname) {
    switch (extname) {
        case ".js":
            return "text/javascript";
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".json":
            return "application/json";
        case ".png":
            return "image/png";
        case ".jpg":
            return "image/jpg";
        case ".jpeg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        case ".webp":
            return "image/webp";
        case ".avif":
            return "image/avif";
    }
}

server.listen(port, () => {
    console.log(`Server running at https://${hostname}:${port}/`);
});