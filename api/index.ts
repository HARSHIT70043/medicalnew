import express, { Request, Response, NextFunction } from 'express';
import { MongoClient } from 'mongodb';
import crypto from 'crypto';

const app = express();
app.use(express.json({ limit: '10mb' }));

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

// Authentication Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    // For this prototype, the token is a base64 encoded email.
    // In a production app, you MUST use JWT (jsonwebtoken) and verify the signature.
    const email = Buffer.from(token, 'base64').toString('ascii');
    if (!email.includes('@')) throw new Error('Invalid token format');
    (req as any).user = { email };
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// API Routes
app.post('/api/login', async (req, res, next) => {
  try {
    const database = await getDB();
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = database.collection('users');
    
    // Hash password for better security (using crypto for prototype)
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    await users.updateOne(
      { email },
      { $set: { email, password: hashedPassword, lastLogin: new Date() } },
      { upsert: true }
    );
    
    // Generate a simple token (base64 encoded email)
    const token = Buffer.from(email).toString('base64');
    
    res.json({ success: true, token, message: 'User logged in successfully' });
  } catch (e) {
    next(e);
  }
});

// Get/Update User Profile (to enhance AI model)
app.get('/api/profile', authenticateToken, async (req, res, next) => {
  try {
    const database = await getDB();
    const email = (req as any).user.email;
    const user = await database.collection('users').findOne({ email }, { projection: { password: 0 } });
    res.json({ success: true, profile: user || {} });
  } catch (e) {
    next(e);
  }
});

app.post('/api/profile', authenticateToken, async (req, res, next) => {
  try {
    const database = await getDB();
    const email = (req as any).user.email;
    const { bloodType, allergies, chronicConditions, age } = req.body;
    
    await database.collection('users').updateOne(
      { email },
      { $set: { bloodType, allergies, chronicConditions, age, updatedAt: new Date() } }
    );
    res.json({ success: true, message: 'Profile updated' });
  } catch (e) {
    next(e);
  }
});

app.post('/api/blood-data', authenticateToken, async (req, res, next) => {
  try {
    const database = await getDB();
    const { hospitals } = req.body;
    
    const bloodData = database.collection('blood_data');
    for (const h of hospitals) {
      await bloodData.updateOne(
        { name: h.name },
        { $set: { ...h, updatedAt: new Date(), updatedBy: (req as any).user.email } },
        { upsert: true }
      );
    }
    res.json({ success: true, message: 'Blood data saved to MongoDB' });
  } catch (e) {
    next(e);
  }
});

app.post('/api/emergency-report', authenticateToken, async (req, res, next) => {
  try {
    const database = await getDB();
    const { photoBase64, description, location, timestamp } = req.body;
    
    if (!photoBase64) {
      return res.status(400).json({ error: 'Photo is required' });
    }

    const emergencyReports = database.collection('emergency_reports');
    const result = await emergencyReports.insertOne({
      photoBase64,
      description,
      location,
      timestamp: timestamp || new Date(),
      status: 'pending',
      reportedBy: (req as any).user.email
    });
    
    res.json({ success: true, message: 'Emergency report saved successfully', id: result.insertedId });
  } catch (e) {
    next(e);
  }
});

// Global Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    dbError: dbConnectionError
  });
});

export default app;
