import { Game, GameType, ServiceError } from "../entities";
import { DeleteGameService, DeleteGameServiceInput } from "./delete-game.service";
import { GameRepository } from "./interfaces";

describe('DeleteGameService', () => {
  let mockSave: jest.Mock;
  let mockFindById: jest.Mock;
  let mockDelete: jest.Mock;
  let mockFindAll: jest.Mock;
  let mockRepository: GameRepository;
  let service: DeleteGameService;
  
  const gameProps = {
    name: 'Catan',
    releaseYear: 1995,
    players: {
      min: 3,
      max: 4
    },
    publisher: 'Kosmos',
    expansions: [],
    standalone: true,
    type: GameType.BaseGame,
    baseGame: undefined
  };
  
  let mockGame: Game;
  
  const validInput: DeleteGameServiceInput = {
    id: 123
  };

  beforeEach(() => {
    mockSave = jest.fn();
    mockFindById = jest.fn();
    mockDelete = jest.fn();
    mockFindAll = jest.fn();
    
    mockRepository = {
      save: mockSave,
      findById: mockFindById,
      delete: mockDelete,
      findAll: mockFindAll
    };
    
    service = new DeleteGameService(mockRepository);
    
    mockGame = {
      id: 123,
      get name() { return gameProps.name; },
      get releaseYear() { return gameProps.releaseYear; },
      get players() { return gameProps.players; },
      get publisher() { return gameProps.publisher; },
      get expansions() { return gameProps.expansions; },
      get standalone() { return gameProps.standalone; },
      get type() { return gameProps.type; },
      get baseGame() { return gameProps.baseGame; }
    } as unknown as Game;
    
    mockFindById.mockResolvedValue(mockGame);
    mockDelete.mockResolvedValue(undefined);
  });

  describe('execute', () => {
    it('should find and delete the game successfully', async () => {
      const result = await service.execute(validInput);

      expect(mockFindById).toHaveBeenCalledWith(123);
      expect(mockDelete).toHaveBeenCalledWith(mockGame);
      expect(result).toBe(mockGame);
    });

    it('should return ServiceError when game is not found', async () => {
      mockFindById.mockResolvedValue(null);

      const result = await service.execute(validInput);

      expect(mockFindById).toHaveBeenCalledWith(123);
      expect(mockDelete).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Game not found');
      }
    });

    it('should return ServiceError when findById throws an error', async () => {
      mockFindById.mockRejectedValue(new Error('Database error'));

      const result = await service.execute(validInput);

      expect(mockFindById).toHaveBeenCalledWith(123);
      expect(mockDelete).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Error deleting game - Database error');
      }
    });

    it('should return ServiceError when delete throws an error', async () => {
      mockDelete.mockRejectedValue(new Error('Delete error'));

      const result = await service.execute(validInput);

      expect(mockFindById).toHaveBeenCalledWith(123);
      expect(mockDelete).toHaveBeenCalledWith(mockGame);
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Error deleting game - Delete error');
      }
    });
  });
});