import { User } from "./user.js";
import { insertEntry, checkUser } from "../database/databaseHandler.js";
import { isEmail } from "../http/inputValidation.js";

export { createUser, createCookie }

async function createUser(query) {
    // Step 1: Split the string by '&'
    const keyValuePairs = recipe.split('&');

    // Step 2-4: Extract key-value pairs and store them in an object
    const data = {};
    for (let i = 0; i < keyValuePairs.length; i++) {
    const [key, value] = keyValuePairs[i].split('=');
    data[key] = value;
    }

    let validEmail = isEmail(data["email"]);

    if (!validEmail) {
        return "invalidEmail";
    }

    // Hash and salt password

    /*  Update to use data object
    let newUser = new User(
        userInfo.fName, 
        userInfo.lName, 
        userInfo.email, 
        userInfo.password
    );
    */

    let exist = await checkUser(userInfo.email)

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