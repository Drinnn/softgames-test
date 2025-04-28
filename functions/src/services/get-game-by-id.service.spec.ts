import { Game, GameType, ServiceError } from "../entities";
import { GetGameByIdService, GetGameByIdServiceInput } from "./get-game-by-id.service";
import { GameRepository } from "./interfaces";

describe('GetGameByIdService', () => {
  let mockSave: jest.Mock;
  let mockFindById: jest.Mock;
  let mockFindAll: jest.Mock;
  let mockDelete: jest.Mock;
  let mockRepository: GameRepository;
  let service: GetGameByIdService;
  
  const mockGame = {
    id: 123,
    name: 'Catan',
    releaseYear: 1995,
    players: { min: 3, max: 4 },
    publisher: 'Kosmos',
    expansions: [],
    standalone: true,
    type: GameType.BaseGame
  } as unknown as Game;

  beforeEach(() => {
    mockSave = jest.fn();
    mockFindById = jest.fn();
    mockFindAll = jest.fn();
    mockDelete = jest.fn();
    
    mockRepository = {
      save: mockSave,
      findById: mockFindById,
      findAll: mockFindAll,
      delete: mockDelete
    };
    
    service = new GetGameByIdService(mockRepository);
    
    mockFindById.mockResolvedValue(mockGame);
  });

  describe('execute', () => {
    it('should return a game when found', async () => {
      const input: GetGameByIdServiceInput = { id: 123 };
      
      const result = await service.execute(input);

      expect(mockFindById).toHaveBeenCalledWith(123);
      expect(result).toBe(mockGame);
      
      if (!(result instanceof ServiceError)) {
        expect(result.id).toBe(123);
        expect(result.name).toBe('Catan');
        expect(result.type).toBe(GameType.BaseGame);
      }
    });

    it('should return ServiceError when game is not found', async () => {
      mockFindById.mockResolvedValue(null);
      
      const input: GetGameByIdServiceInput = { id: 999 };
      
      const result = await service.execute(input);

      expect(mockFindById).toHaveBeenCalledWith(999);
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Game not found');
      }
    });

    it('should return ServiceError when repository throws an error', async () => {
      mockFindById.mockRejectedValue(new Error('Database error'));
      
      const input: GetGameByIdServiceInput = { id: 123 };
      
      const result = await service.execute(input);

      expect(mockFindById).toHaveBeenCalledWith(123);
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Error getting game by id - Database error');
      }
    });
  });
});
