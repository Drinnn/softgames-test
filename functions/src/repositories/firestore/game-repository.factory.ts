import { getFirestore } from '../../apis/firestore/getFirestore';
import { FirestoreGameRepository } from './game.repository';

let gameRepository: FirestoreGameRepository | null = null;


export function getGameRepository(): FirestoreGameRepository {
  if (!gameRepository) {
    const firestore = getFirestore();
    gameRepository = new FirestoreGameRepository(firestore);
  }
  
  return gameRepository;
} 