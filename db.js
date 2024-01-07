const { MongoClient } = require('mongodb');

const URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'graph_db';

const DBCollections = {
    graph: undefined,
    topics: undefined,
    photos: undefined,
}

// Подключение к MongoDB
async function connectToDatabase() {
    const client = new MongoClient(URI, { useUnifiedTopology: true });
    try {
        await client.connect();
        console.log('Connecting to the database...');

        const database = client.db((DB_NAME));
        const collections = await database.listCollections().toArray();

        console.log('Collections in db:', collections.map(collection => collection.name));


        // Создаём коллекции
        for (const colName of Object.keys(DBCollections)) {
            DBCollections[colName] = database.collection(colName);
            // const cursor = await DBCollections[colName].find();
            // console.log(cursor)
            // console.log(colName, ':',  await DBCollections[colName].countDocuments(cursor));
            const cursor = await DBCollections[colName].find().toArray();
            // console.log(cursor);
            console.log(colName, ':', cursor.length);

        }

        console.log('Connection setted up.');
        return client;
    } catch (e) {
        console.log('Error while connecting to database: ', e);
        console.log('Connection to the database closed.');
        await client.close();
    }
    return null;
}

module.exports = { connectToDatabase, DBCollections };
