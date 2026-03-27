import express from 'express';
import { createServer as createViteServer } from 'vite';
import { MongoClient } from 'mongodb';
import path from 'path';

const app = express();
app.use(express.json());

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';

let db: any = null;
let dbConnectionError: string | null = null;

async function connectDB() {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Database features will be disabled.");
    dbConnectionError = "MONGODB_URI secret is missing.";
    return;
  }
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    // Add a 5-second timeout so it doesn't hang forever if IP is blocked
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    db = client.db('healthconnect');
    dbConnectionError = null;
    console.log("Connected to MongoDB Atlas successfully!");
  } catch (e: any) {
    if (e.message && e.message.includes('alert number 80')) {
      dbConnectionError = "MongoDB Atlas blocked the connection (SSL alert 80). Your IP address is NOT whitelisted in MongoDB Atlas.";
    } else if (e.message && e.message.includes('bad auth')) {
      dbConnectionError = "MongoDB Authentication Failed: Incorrect username or password in your MONGODB_URI secret. Please check your AI Studio Settings.";
    } else {
      dbConnectionError = e.message;
    }
    console.error("MongoDB connection error:", e.message);
    db = null; // Ensure db is null if connection fails
  }
}

connectDB();

// API Routes
app.post('/api/login', async (req, res) => {
  if (!db) return res.status(500).json({ error: dbConnectionError || 'Database not connected' });
  const { email, password } = req.body;
  
  try {
    const users = db.collection('users');
    // Upsert user credentials (for prototype purposes)
    await users.updateOne(
      { email },
      { $set: { email, password, lastLogin: new Date() } },
      { upsert: true }
    );
    res.json({ success: true, message: 'User logged in and saved to MongoDB' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save user to MongoDB' });
  }
});

app.post('/api/blood-data', async (req, res) => {
  if (!db) return res.status(500).json({ error: dbConnectionError || 'Database not connected' });
  const { hospitals } = req.body;
  
  try {
    const bloodData = db.collection('blood_data');
    // Update or insert each hospital's blood data
    for (const h of hospitals) {
      await bloodData.updateOne(
        { name: h.name },
        { $set: { ...h, updatedAt: new Date() } },
        { upsert: true }
      );
    }
    res.json({ success: true, message: 'Blood data saved to MongoDB' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save blood data to MongoDB' });
  }
});

// Vite Middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
