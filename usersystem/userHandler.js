import cookieParser from 'cookie-parser';
import bcrypt from "bcrypt";
import { User } from "./user.js";
import { insertEntry, checkUser } from "../database/databaseHandler.js";
import { isEmail } from "../http/inputValidation.js";

export { createUser, createCookie }

async function createUser(query) {
    // Step 1: Split the string by '&'
    const keyValuePairs = query.split('&');

    // Step 2-4: Extract key-value pairs and store them in an object
    const data = {};
    for (let i = 0; i < keyValuePairs.length; i++) {
    const [key, value] = keyValuePairs[i].split('=');
    data[key] = value;
    }
    data["mail"] = data["mail"].replace("%40", "@");

    let validEmail = isEmail(data["mail"]);

    if (!validEmail) {
        return "invalidEmail";
    }

    // Salt and hash password
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(data["password"], salt);
        
        data["password"] = hash;
    } catch (err) {
        // Handle error
        console.error(err);
    }

    let newUser = new User(
        data["firstName"], 
        data["lastName"], 
        data["mail"], 
        data["password"]
    );
   

    let exist = await checkUser(data["mail"])

    if (exist) {
        let result = await insertEntry("users", newUser);
        if (result) {
            return createCookie(newUser);
        }
    } else {
        return "userExists";
    }
}

function createCookie(user) {
    const userData = {
        firstName: user.fName,
        lastName: user.lName,
        email: user.email,
        userToken: user.userToken
    };

    const cookieOptions = {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
    };
    const cookieValue = JSON.stringify(userData);
  
    const signedCookie = cookieParser.signedCookie(cookieValue, process.env.COOKIE_SECRET);
    
    return { cookieName: 'currentUser', cookieValue: signedCookie, cookieOptions };
}