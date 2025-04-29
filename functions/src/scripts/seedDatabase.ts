import { seedFirestore } from '../utils/seedFirestore';

async function main() {
  try {
    console.log('Starting database seeding...');
    if (!process.env.FIRESTORE_EMULATOR_HOST) {
      console.warn('WARNING: FIRESTORE_EMULATOR_HOST is not set. Seeding might fail or target production!');
    }
    await seedFirestore();
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

main(); 