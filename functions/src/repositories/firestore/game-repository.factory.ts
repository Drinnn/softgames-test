import { getFirestore } from 'firebase-admin/firestore';
import { FirestoreGameRepository } from './game.repository';

let gameRepository: FirestoreGameRepository | null = null;


export function getGameRepository(): FirestoreGameRepository {
  if (!gameRepository) {
    const firestore = getFirestore();
    gameRepository = new FirestoreGameRepository(firestore);
  }
  
  return gameRepository;
} 