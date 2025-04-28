import { Game, GameType, ServiceError } from "../entities";
import { GetAllGamesService } from "./get-all-games.service";
import { GameRepository } from "./interfaces";

describe('GetAllGamesService', () => {
  let mockFindAll: jest.Mock;
  let mockSave: jest.Mock;
  let mockFindById: jest.Mock;
  let mockDelete: jest.Mock;
  let mockRepository: GameRepository;
  let service: GetAllGamesService;
  
  const mockGames = [
    {
      id: 123,
      name: 'Catan',
      releaseYear: 1995,
      players: { min: 3, max: 4 },
      publisher: 'Kosmos',
      expansions: [],
      standalone: true,
      type: GameType.BaseGame
    },
    {
      id: 456,
      name: 'Catan: Seafarers',
      releaseYear: 1997,
      players: { min: 3, max: 4 },
      publisher: 'Kosmos',
      expansions: [],
      standalone: false,
      type: GameType.Expansion,
      baseGame: 123
    }
  ] as unknown as Game[];

  beforeEach(() => {
    mockFindAll = jest.fn();
    mockSave = jest.fn();
    mockFindById = jest.fn();
    mockDelete = jest.fn();
    
    mockRepository = {
      findAll: mockFindAll,
      save: mockSave,
      findById: mockFindById,
      delete: mockDelete
    };
    
    service = new GetAllGamesService(mockRepository);
    
    mockFindAll.mockResolvedValue(mockGames);
  });

  describe('execute', () => {
    it('should return all games when successful', async () => {
      const result = await service.execute();

      expect(mockFindAll).toHaveBeenCalled();
      expect(result).toBe(mockGames);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      
      if (Array.isArray(result)) {
        expect(result[0].name).toBe('Catan');
        expect(result[0].type).toBe(GameType.BaseGame);
        
        expect(result[1].name).toBe('Catan: Seafarers');
        expect(result[1].type).toBe(GameType.Expansion);
        expect(result[1].baseGame).toBe(123);
      }
    });

    it('should return empty array when no games exist', async () => {
      mockFindAll.mockResolvedValue([]);
      
      const result = await service.execute();
      
      expect(mockFindAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should return ServiceError when findAll throws an error', async () => {
      mockFindAll.mockRejectedValue(new Error('Database error'));
      
      const result = await service.execute();
      
      expect(mockFindAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ServiceError);
      
      if (result instanceof ServiceError) {
        expect(result.message).toBe('Error getting all games - Database error');
      }
    });
  });
});
