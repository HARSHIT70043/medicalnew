import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());

let client: MongoClient | null = null;
let db: any = null;
let dbConnectionError: string | null = null;

// Connect to DB dynamically inside the route (Serverless best practice)
async function getDB() {
  if (db) return db;
  
  const MONGODB_URI = process.env.MONGODB_URI || '';
  if (!MONGODB_URI) {
    dbConnectionError = "MONGODB_URI secret is missing.";
    throw new Error(dbConnectionError);
  }
  
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
    }
    db = client.db('healthconnect');
    dbConnectionError = null;
    console.log("Connected to MongoDB Atlas successfully!");
    return db;
  } catch (e: any) {
    if (e.message && e.message.includes('alert number 80')) {
      dbConnectionError = "MongoDB Atlas blocked the connection (SSL alert 80). Your IP address is NOT whitelisted in MongoDB Atlas.";
    } else if (e.message && e.message.includes('bad auth')) {
      dbConnectionError = "MongoDB Authentication Failed: Incorrect username or password in your MONGODB_URI secret. Please check your AI Studio Settings.";
    } else {
      dbConnectionError = e.message;
    }
    client = null;
    db = null;
    console.error("MongoDB connection error:", e.message);
    throw new Error(dbConnectionError);
  }
}

// API Routes
app.post('/api/login', async (req, res) => {
  try {
    const database = await getDB();
    const { email, password } = req.body;
    
    const users = database.collection('users');
    await users.updateOne(
      { email },
      { $set: { email, password, lastLogin: new Date() } },
      { upsert: true }
    );
    res.json({ success: true, message: 'User logged in and saved to MongoDB' });
  } catch (e: any) {
    console.error("Login Error:", e);
    res.status(500).json({ error: dbConnectionError || e.message || 'Database not connected' });
  }
});

app.post('/api/blood-data', async (req, res) => {
  try {
    const database = await getDB();
    const { hospitals } = req.body;
    
    const bloodData = database.collection('blood_data');
    for (const h of hospitals) {
      await bloodData.updateOne(
        { name: h.name },
        { $set: { ...h, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    res.json({ success: true, message: 'Blood data saved to MongoDB' });
  } catch (e: any) {
    console.error("Blood Data Error:", e);
    res.status(500).json({ error: dbConnectionError || e.message || 'Database not connected' });
  }
});

export default app;
