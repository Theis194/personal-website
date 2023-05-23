import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

export{ insertEntry }

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
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}