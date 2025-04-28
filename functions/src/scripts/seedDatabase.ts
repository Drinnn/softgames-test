import { seedFirestore } from '../utils/seedFirestore';


async function main() {
  try {
    console.log('Starting database seeding...');
    await seedFirestore();
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
}

main(); 