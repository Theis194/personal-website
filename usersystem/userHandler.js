import cookieParser from 'cookie-parser';
import bcrypt from "bcrypt";
import { User } from "./user.js";
import { insertEntry, checkUser } from "../database/databaseHandler.js";
import { isEmail, extractData } from "../http/inputValidation.js";

export { createUser, loginUser, createCookie }

async function createUser(query) {
    const data = extractData(query);

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

    if (exist == false) {
        let result = await insertEntry("users", newUser);
        if (result) {
            return createCookie(newUser);
        }
    } else {
        return "userExists";
    }
}

async function loginUser(query) {
    const data = extractData(query);
    data["mail"] = data["mail"].replace("%40", "@");

    if (!isEmail(data["mail"])) {
        return "invalidEmail"
    }
    
    const user = await checkUser(data["mail"])

    let compare = await comparePassword(data["password"], user.password).then(result => {
        if (result) {
            return true;
        } else {
            return "wrongPassword";
        }
    });

    if (compare == true) {
        let cookie = createCookie(user);
        return  cookie
    }
    return compare;
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
        sameSite: "lax",
        path: "/"
    };
    const cookieValue = JSON.stringify(userData);
  
    const signedCookie = cookieParser.signedCookie(cookieValue, process.env.COOKIE_SECRET);
    
    let cookie = { cookieName: 'currentUser', cookieValue: signedCookie, cookieOptions };
    return cookie;
}

async function comparePassword(plainPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}