import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config;

export{ insertEntry, checkUser }

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

async function checkUser(email) {
    try {
        client = await establishConnection();
        const result = await client.db("cookbook").collection(collection).findOne({email: email});
        if (result) {
            return false
        }
        return true;
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}