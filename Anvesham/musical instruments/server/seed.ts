import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Instrument } from './models/Instrument.ts';
import { initialInstruments } from './data/instrumentsData.ts';

dotenv.config();

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sursanskriti';
  console.log(`Starting database seed using: ${mongoUri}...`);

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB.');

    const deleted = await Instrument.deleteMany({});
    console.log(`Cleared existing instruments (${deleted.deletedCount} removed).`);

    const inserted = await Instrument.insertMany(initialInstruments as any);
    console.log(`🎉 Successfully seeded ${inserted.length} Indian traditional musical instruments!`);

    await mongoose.disconnect();
    console.log('Disconnected from database. Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
