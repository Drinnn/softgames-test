import { Firestore, CollectionReference } from 'firebase-admin/firestore';
import { Game, GameProps, GameType } from '../../entities';
import { GameRepository } from '../../services/interfaces';

export class FirestoreGameRepository implements GameRepository {
  private readonly collectionName = 'games';
  private gamesCollection: CollectionReference;

  constructor(private readonly firestore: Firestore) {
    this.gamesCollection = this.firestore.collection(this.collectionName);
  }

  async save(game: Game): Promise<Game> {
    const gameData = this.toFirestore(game);
    await this.gamesCollection.doc(game.id.toString()).set(gameData);
    return game;
  }

  async findById(id: number): Promise<Game | null> {
    const docRef = this.gamesCollection.doc(id.toString());
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return this.fromFirestore(doc.id, doc.data() as FirestoreGameData);
  }

  async findAll(): Promise<Game[]> {
    const snapshot = await this.gamesCollection.get();
    
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => 
      this.fromFirestore(doc.id, doc.data() as FirestoreGameData)
    );
  }

  async delete(game: Game): Promise<void> {
    await this.gamesCollection.doc(game.id.toString()).delete();
  }

  private toFirestore(game: Game): FirestoreGameData {
    return {
      name: game.name,
      releaseYear: game.releaseYear,
      players: {
        min: game.players.min,
        max: game.players.max
      },
      publisher: game.publisher,
      expansions: game.expansions,
      standalone: game.standalone,
      type: game.type,
      baseGame: game.baseGame
    };
  }

  private fromFirestore(id: string, data: FirestoreGameData): Game {
    const gameProps: GameProps = {
      name: data.name,
      releaseYear: data.releaseYear,
      players: {
        min: data.players.min,
        max: data.players.max
      },
      publisher: data.publisher,
      expansions: data.expansions || [],
      standalone: data.standalone,
      type: data.type as GameType,
      baseGame: data.baseGame
    };

    return Game.create(gameProps, Number(id));
  }
}

interface FirestoreGameData {
  name: string;
  releaseYear: number;
  players: {
    min: number;
    max: number;
  };
  publisher: string;
  expansions: number[];
  standalone?: boolean;
  type: string;
  baseGame?: number;
} 