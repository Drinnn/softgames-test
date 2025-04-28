import { Request, Response } from 'express';
import { GetAllGamesController } from './get-all-games.controller';
import { GetAllGamesService } from '../../services';
import { Game, GameType, HttpError, ServiceError } from '../../entities';

describe('GetAllGamesController', () => {
  let mockExecute: jest.Mock;
  let mockService: GetAllGamesService;
  let controller: GetAllGamesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockExecute = jest.fn();
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockService = {
      execute: mockExecute
    } as unknown as GetAllGamesService;
    
    controller = new GetAllGamesController(mockService);
    
    mockRequest = {};
    
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return 200 and games data when execution succeeds', async () => {
      const mockGames = [
        Game.create({
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
        }, 1),
        Game.create({
          name: 'Monopoly',
          releaseYear: 1935,
          players: {
            min: 2,
            max: 8
          },
          publisher: 'Hasbro',
          expansions: [],
          standalone: true,
          type: GameType.BaseGame
        }, 2)
      ];
      
      mockExecute.mockResolvedValue(mockGames);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockGames);
    });

    it('should return 400 when service returns ServiceError', async () => {
      const serviceError = new ServiceError('Failed to fetch games');
      
      mockExecute.mockResolvedValue(serviceError);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: serviceError.message
      });
    });

    it('should return 500 when an unexpected error is thrown', async () => {
      const error = new Error('Unexpected error');
      
      mockExecute.mockRejectedValue(error);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });

    it('should return HttpError status when an HttpError is thrown', async () => {
      const httpError = new HttpError('Not found', 404);
      
      mockExecute.mockRejectedValue(httpError);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: httpError.message
      });
    });
  });
});
