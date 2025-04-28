import { Game, GameType, ServiceError } from "../entities";
import { UpdateGameService, UpdateGameServiceInput } from "./update-game.service";
import { GameRepository } from "./interfaces";

describe('UpdateGameService', () => {
  let mockSave: jest.Mock;
  let mockFindById: jest.Mock;
  let mockDelete: jest.Mock;
  let mockFindAll: jest.Mock;
  let mockRepository: GameRepository;
  let service: UpdateGameService;
  
  const gameId = 123;
  
  const mockGame = {
    id: gameId,
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
    update: jest.fn(),
    get baseGame() { return undefined; }
  } as unknown as Game;

  beforeEach(() => {
    mockSave = jest.fn();
    mockFindById = jest.fn();
    mockDelete = jest.fn();
    mockFindAll = jest.fn();
    (mockGame.update as jest.Mock).mockReset();
    
    mockRepository = {
      save: mockSave,
      findById: mockFindById,
      delete: mockDelete,
      findAll: mockFindAll
    };
    
    service = new UpdateGameService(mockRepository);
    
    mockFindById.mockResolvedValue(mockGame);
    mockSave.mockResolvedValue(mockGame);
  });

  describe('execute', () => {
    it('should update an existing game with partial data', async () => {
      const updateInput: UpdateGameServiceInput = {
        gameId,
        name: 'Updated Catan',
        releaseYear: 2000
      };

      const result = await service.execute(updateInput);

      expect(mockFindById).toHaveBeenCalledWith(gameId);
      expect(mockGame.update).toHaveBeenCalledWith({ 
        name: 'Updated Catan', 
        releaseYear: 2000,
        players: undefined,
        publisher: undefined,
        expansions: undefined,
        standalone: undefined,
        type: undefined,
        baseGame: undefined
      });
      expect(mockSave).toHaveBeenCalledWith(mockGame);
      expect(result).toBe(mockGame);
    });

    it('should return error when gameId is not provided', async () => {
      const updateInput: UpdateGameServiceInput = {
        name: 'Updated Catan'
      };

      const result = await service.execute(updateInput);

      expect(mockFindById).not.toHaveBeenCalled();
      expect(mockGame.update).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Game ID is required');
      }
    });

    it('should return error when game is not found', async () => {
      mockFindById.mockResolvedValue(null);
      
      const updateInput: UpdateGameServiceInput = {
        gameId,
        name: 'Updated Catan'
      };

      const result = await service.execute(updateInput);

      expect(mockFindById).toHaveBeenCalledWith(gameId);
      expect(mockGame.update).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Game not found');
      }
    });

    it('should return error when update fails validation', async () => {
      (mockGame.update as jest.Mock).mockImplementation(() => {
        throw new Error('Validation failed');
      });
      
      const updateInput: UpdateGameServiceInput = {
        gameId,
        name: 'Updated Catan'
      };

      const result = await service.execute(updateInput);

      expect(mockFindById).toHaveBeenCalledWith(gameId);
      expect(mockGame.update).toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Error updating game - Validation failed');
      }
    });

    it('should return error when save fails', async () => {
      mockSave.mockRejectedValue(new Error('Database error'));
      
      const updateInput: UpdateGameServiceInput = {
        gameId,
        name: 'Updated Catan'
      };

      const result = await service.execute(updateInput);

      expect(mockFindById).toHaveBeenCalledWith(gameId);
      expect(mockGame.update).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Error updating game - Database error');
      }
    });

    it('should update game type with related properties', async () => {
      const updateInput: UpdateGameServiceInput = {
        gameId,
        type: GameType.Expansion,
        baseGame: 456
      };

      await service.execute(updateInput);

      expect(mockGame.update).toHaveBeenCalledWith({
        name: undefined,
        releaseYear: undefined,
        players: undefined,
        publisher: undefined,
        expansions: undefined,
        standalone: undefined,
        type: GameType.Expansion,
        baseGame: 456
      });
    });
  });
}); 