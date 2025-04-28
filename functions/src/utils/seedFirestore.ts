import * as fs from 'fs';
import * as path from 'path';
import { getFirestore } from '../apis/firestore/getFirestore';

export async function seedFirestore(jsonPath = '../../../games.json'): Promise<void> {
  try {
    const resolvedPath = path.resolve(__dirname, jsonPath);
    console.log(`Reading games data from: ${resolvedPath}`);
    
    const gamesData = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    console.log(`Found ${gamesData.length} games to seed`);
    
    const db = getFirestore();
    const gamesCollection = db.collection('games');
    
    const batch = db.batch();
    
    for (const game of gamesData) {
      const docRef = gamesCollection.doc(game.id);
      batch.set(docRef, game);
    }
    
    await batch.commit();
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
} 