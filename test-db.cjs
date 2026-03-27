const { MongoClient } = require('mongodb');

async function checkConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("ERROR: MONGODB_URI is not set.");
    process.exit(1);
  }
  
  console.log("Testing connection to MongoDB...");
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    console.log("SUCCESS: Connected to MongoDB Atlas successfully! Authentication passed.");
    await client.close();
  } catch (err) {
    console.log("ERROR: " + err.message);
  }
}

checkConnection();
