import { Firestore, CollectionReference, DocumentReference, DocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { FirestoreGameRepository } from './game.repository';
import { Game, GameType } from '../../entities';

describe('FirestoreGameRepository', () => {
  let mockCollection: jest.Mock;
  let mockDoc: jest.Mock;
  let mockSet: jest.Mock;
  let mockGet: jest.Mock;
  let mockDelete: jest.Mock;
  let mockFirestore: Firestore;
  let mockCollectionRef: CollectionReference;
  let mockDocRef: DocumentReference;
  let mockDocSnapshot: DocumentSnapshot;
  let mockQuerySnapshot: QuerySnapshot;
  
  let repository: FirestoreGameRepository;
  
  const gameId = 123;
  const gameName = 'Catan';
  
  const firestoreData = {
    name: gameName,
    releaseYear: 1995,
    players: {
      min: 3,
      max: 4
    },
    publisher: 'Kosmos',
    expansions: [],
    standalone: true,
    type: GameType.BaseGame
  };
  
  const mockGame = {
    id: gameId,
    name: gameName,
    releaseYear: 1995,
    players: {
      min: 3,
      max: 4
    },
    publisher: 'Kosmos',
    expansions: [],
    standalone: true,
    type: GameType.BaseGame
  } as unknown as Game;

  function createDocSnapshot(exists: boolean): DocumentSnapshot {
    return {
      id: gameId.toString(),
      exists: exists,
      data: jest.fn().mockReturnValue(firestoreData)
    } as unknown as DocumentSnapshot;
  }

  function createQuerySnapshot(empty: boolean): QuerySnapshot {
    return {
      empty: empty,
      docs: empty ? [] : [createDocSnapshot(true)]
    } as unknown as QuerySnapshot;
  }

  beforeEach(() => {
    mockSet = jest.fn().mockResolvedValue(null);
    mockDelete = jest.fn().mockResolvedValue(null);
    
    mockDocSnapshot = createDocSnapshot(true);
    mockGet = jest.fn().mockResolvedValue(mockDocSnapshot);
    
    mockDocRef = {
      get: mockGet,
      set: mockSet,
      delete: mockDelete
    } as unknown as DocumentReference;
    
    mockDoc = jest.fn().mockReturnValue(mockDocRef);
    
    mockQuerySnapshot = createQuerySnapshot(false);
    
    mockCollectionRef = {
      doc: mockDoc,
      get: jest.fn().mockResolvedValue(mockQuerySnapshot)
    } as unknown as CollectionReference;
    
    mockCollection = jest.fn().mockReturnValue(mockCollectionRef);
    
    mockFirestore = {
      collection: mockCollection
    } as unknown as Firestore;
    
    repository = new FirestoreGameRepository(mockFirestore);
    
    jest.spyOn(Game, 'create').mockReturnValue(mockGame as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save a game to Firestore', async () => {
      const result = await repository.save(mockGame);
      
      expect(mockCollection).toHaveBeenCalledWith('games');
      expect(mockDoc).toHaveBeenCalledWith(gameId.toString());
      expect(mockSet).toHaveBeenCalledWith(expect.objectContaining({
        name: gameName
      }));
      expect(result).toBe(mockGame);
    });
  });

  describe('findById', () => {
    it('should return a game when found', async () => {
      const result = await repository.findById(gameId);
      
      expect(mockCollection).toHaveBeenCalledWith('games');
      expect(mockDoc).toHaveBeenCalledWith(gameId.toString());
      expect(mockGet).toHaveBeenCalled();
      expect(result).toBe(mockGame);
    });

    it('should return null when game is not found', async () => {
      const notFoundSnapshot = createDocSnapshot(false);
      mockGet.mockResolvedValueOnce(notFoundSnapshot);
      
      const result = await repository.findById(gameId);
      
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all games', async () => {
      const result = await repository.findAll();
      
      expect(result).toEqual([mockGame]);
      expect(mockCollectionRef.get).toHaveBeenCalled();
    });

    it('should return empty array when no games exist', async () => {
      const emptySnapshot = createQuerySnapshot(true);
      mockCollectionRef.get = jest.fn().mockResolvedValueOnce(emptySnapshot);
      
      const result = await repository.findAll();
      
      expect(result).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete a game', async () => {
      await repository.delete(mockGame);
      
      expect(mockCollection).toHaveBeenCalledWith('games');
      expect(mockDoc).toHaveBeenCalledWith(gameId.toString());
      expect(mockDelete).toHaveBeenCalled();
    });
  });
}); 