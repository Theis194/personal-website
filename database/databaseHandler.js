import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config;

export{ 
    insertEntry, 
    getRecipes, 
    getRecipeById, 
    checkUser, 
    updateUserDB, 
    updateFavorite,
    getFavorites 
}

async function establishConnection() {
    const uri = process.env.DATABASE_URL;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        return client;
    } catch (error) {
        console.error(error);
    }
}

async function basicFunction() {
    let client;

    try {
        client = await establishConnection();


    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function insertEntry(collection, newEntry) {
    let client;

    try {
        client = await establishConnection();
        const result = await client.db("cookbook").collection(collection).insertOne(newEntry);

        return result;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

      /////////////////////////////////////////////////////////////////////////////
   ///////                                              Recipe functions                                                     ///////
/////////////////////////////////////////////////////////////////////////////

async function getRecipes() {
    let client;

    try {
        client = await establishConnection();

        const result = await client.db("cookbook").collection("recipes").find().limit(5).toArray();

        return result;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function getRecipeById(id) {
    let client;

    try {
        client = await establishConnection();
        const result = await client.db("cookbook").collection("recipes").findOne({_id: new ObjectId(id)})

        return result
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

      /////////////////////////////////////////////////////////////////////////////
   ////////                                           User System functions                                        /////////
/////////////////////////////////////////////////////////////////////////////

async function checkUser(email) {
    let client;
    console.log(email);
    try {
        client = await establishConnection();
        const result = await client.db("cookbook").collection("users").findOne({email: email});
        if (!result) {
            return false
        }
        return result;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function updateUserDB(user) {
    let client;

    try {
        client = await establishConnection();
        const result = await client.db("cookbook").collection("users").updateOne(
            {_id: user._id},
            {
                $set: {fName: user.fName},
                $set: {lName: user.lName},
                $set: {email: user.email},
                $set: {privileges: user.privileges}
            }
        );
        if (!result) {
            return false
        }
        return true;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function updateFavorite(userToken, eventId) {
    let client;

    try {
        client = await establishConnection();
        
        const result = await client.db("cookbook").collection("users").findOne({userToken: userToken});
        let favorites = result.favorites

        const duplicate = favorites.includes(eventId);
        if (!duplicate) {
            // Addes the event id to the users list of favorites
            favorites.push(eventId);
            const updateResult = await client.db("cookbook").collection("users").updateOne(
                {userToken: userToken}, 
                {$set: {favorites: favorites}});
            if (updateResult) {
                // favorites updated
                return true;
            }
            // favorites not updated
            return false;
        } else {
            // Removes the event id to the users list of favorites
            favorites.splice(favorites.indexOf(eventId), 1);
            const updateResult = await client.db("cookbook").collection("users").updateOne(
                {userToken: userToken}, 
                {$set: {favorites: favorites}});
            if (updateResult) {
                // favorites updated
                return true;
            }
        }
        // event id is duplicate
        return false;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

async function getFavorites(userToken) {
    let client;

    try {
        client = await establishConnection();

        let user = await client.db("cookbook").collection("users").findOne({userToken: userToken});

        for (let i = 0; i < user.favorites.length; i++) {
            user.favorites[i] = new ObjectId(user.favorites[i]);
        }

        if (user) {
            let favorites = await client.db("cookbook").collection("recipes").find({_id: {$in: user.favorites}}).toArray();
            if (favorites.length >= 1) {
                return favorites;
            }
        }
        return false;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}