import http from "http";
import fs from "fs";
import url from "url";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import { createNewRecipe } from "../Recipe/recipe.js"
import { createCookie, createUser } from "../usersystem/userHandler.js";
import { userInfo } from "os";

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDirectoryPath = path.join(__dirname, "public");

const server = http.createServer(async (req, res) =>{
    let method = req.method;
    let _url = req.url;
    switch (method) {
        case "GET": // Read
            switch (_url) {
                case "/getThing": // Standard response
                    
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
                    let formData = "";
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
                    let userInfo = "";
                    req.on("data", chunk => {
                        userInfo += chunk.toString();
                    });
                    req.on("end", () => {
                        // Process the form data
                        const result = createUser(userInfo);

                        if (result == true) { // Success
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end(JSON.stringify(result));
                        } else { // Error
                            res.writeHead(400, { "Content-Type": "text/plain" });
                            res.end(result);
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
            
            break;
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
    console.log(`Server running at http://${hostname}:${port}/`);
});