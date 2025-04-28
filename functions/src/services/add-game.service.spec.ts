import { Game, GameType, ServiceError } from "../entities";
import { GameRepository } from "./interfaces";
import { AddGameService, AddGameServiceInput } from "./add-game.service";

describe('AddGameService', () => {
  let mockSave: jest.Mock;
  let mockFindById: jest.Mock;
  let mockDelete: jest.Mock;
  let mockRepository: GameRepository;
  let service: AddGameService;
  
  const validGameInput: AddGameServiceInput = {
    name: 'Catan',
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

  beforeEach(() => {
    mockSave = jest.fn();
    mockFindById = jest.fn();
    mockDelete = jest.fn();
    
    mockRepository = {
      save: mockSave,
      findById: mockFindById,
      delete: mockDelete
    };
    
    service = new AddGameService(mockRepository);
    
    mockSave.mockImplementation(game => Promise.resolve(game));
  });

  describe('execute', () => {
    it('should create and save a valid game', async () => {
      const result = await service.execute(validGameInput);

      expect(result).toBeInstanceOf(Game);
      expect(mockSave).toHaveBeenCalledTimes(1);
      
      if (result instanceof Game) {
        expect(result.name).toBe(validGameInput.name);
        expect(result.releaseYear).toBe(validGameInput.releaseYear);
        expect(result.publisher).toBe(validGameInput.publisher);
        expect(result.type).toBe(GameType.BaseGame);
      }
    });

    it('should create an expansion with base game reference', async () => {
      const expansionInput = {
        ...validGameInput,
        name: 'Catan: Seafarers',
        type: GameType.Expansion,
        baseGame: 123,
        standalone: false
      };

      const result = await service.execute(expansionInput);

      expect(result).toBeInstanceOf(Game);
      
      if (result instanceof Game) {
        expect(result.type).toBe(GameType.Expansion);
        expect(result.baseGame).toBe(123);
      }
    });

    it('should return ServiceError when game creation fails', async () => {
      const invalidInput = {
        ...validGameInput,
        name: '' 
      };

      const result = await service.execute(invalidInput);

      expect(result).toBeInstanceOf(ServiceError);
      expect(mockSave).not.toHaveBeenCalled();
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Error adding game - Game: Name is required');
      }
    });

    it('should return ServiceError when repository save fails', async () => {
      mockSave.mockRejectedValue(new Error('Database error'));

      const result = await service.execute(validGameInput);

      expect(result).toBeInstanceOf(ServiceError);
      expect(mockSave).toHaveBeenCalledTimes(1);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Error adding game - Database error');
      }
    });
  });
}); 