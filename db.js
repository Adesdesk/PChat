
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
let access = process.env.DATABASE_ACCESS;

let uri = "mongodb+srv://adesdeskUser01:" + access + "@adesdeskdatabase01.7znhfhj.mongodb.net/?retryWrites=true&w=majority";

// Creating a MongoClient with a MongoClientOptions object to set Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('sample_supplies');
    const collection = db.collection('sales');

    // Find the first document in the collection
    const first = await collection.findOne();
    console.log(first);
    //const first = await db.deleteMany();
    //console.log("deletion completed");
  } finally {
    // Close the database connection when finished or if an error occurs
    await client.close();
  }
}
run().catch(console.error);
