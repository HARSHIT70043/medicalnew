import { MongoClient } from 'mongodb';
import crypto from 'crypto';

const uri = process.env.MONGODB_URI || '';

async function seed() {
  if (!uri) {
    console.error("ERROR: MONGODB_URI is not set.");
    process.exit(1);
  }
  
  const client = new MongoClient(uri);
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db('healthconnect');
    
    console.log("Connected. Seeding data...");
    
    // 1. Seed Hospitals / Blood Data
    const bloodData = db.collection('blood_data');
    const hospitals = [];
    const bloodTypesList = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    
    for (let i = 0; i < 500; i++) {
      // Randomly select 2-5 blood types
      const availableBloodTypes = bloodTypesList
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4) + 2);

      hospitals.push({
        name: `City Medical Center ${i}`,
        address: `${Math.floor(Math.random() * 9000) + 100} Main St, District ${Math.floor(Math.random() * 20)}`,
        generalBeds: Math.floor(Math.random() * 150),
        icuBeds: Math.floor(Math.random() * 30),
        bloodTypes: availableBloodTypes,
        updatedAt: new Date(),
        updatedBy: 'system_seed'
      });
    }
    await bloodData.insertMany(hospitals);
    console.log(`Seeded ${hospitals.length} hospitals with blood data.`);
    
    // 2. Seed Emergency Reports with large images to reach ~120MB
    // 120 records * ~1MB base64 string = ~120MB
    const emergencyReports = db.collection('emergency_reports');
    
    // Generate a 750KB random buffer, which becomes ~1MB when base64 encoded
    const largeBuffer = crypto.randomBytes(750000);
    const largeString = largeBuffer.toString('base64');
    
    let insertedMB = 0;
    const targetMB = 120;
    
    console.log(`Starting to insert ~${targetMB}MB of emergency report data...`);
    for (let i = 0; i < targetMB; i++) {
      await emergencyReports.insertOne({
        photoBase64: `data:image/jpeg;base64,${largeString}`,
        description: `Simulated emergency report ${i} for load testing and data volume requirements.`,
        location: `Lat: ${(Math.random() * 180 - 90).toFixed(4)}, Lng: ${(Math.random() * 360 - 180).toFixed(4)}`,
        timestamp: new Date(),
        status: 'pending',
        reportedBy: 'system_seed'
      });
      insertedMB += 1;
      if (insertedMB % 10 === 0) {
        console.log(`Inserted ${insertedMB} MB of emergency reports...`);
      }
    }
    
    console.log("Seeding complete. Successfully added >100MB of data to MongoDB.");
  } catch (e) {
    console.error("Error during seeding:", e);
  } finally {
    await client.close();
  }
}

seed();
