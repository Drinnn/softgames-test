import { Request, Response } from 'express';
import { DeleteGameController } from './delete-game.controller';
import { Game, GameType, HttpError, ServiceError } from '../../entities';
import * as dtos from './dtos';
import { ZodError } from 'zod';
import { DeleteGameService } from '../../services';
jest.mock('./dtos', () => ({
  validateDeleteGameDto: jest.fn()
}));

describe('DeleteGameController', () => {
  let mockExecute: jest.Mock;
  let mockService: DeleteGameService;
  let controller: DeleteGameController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  
  const validGameId = 123;

  beforeEach(() => {
    mockExecute = jest.fn();
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockService = {
      execute: mockExecute
    } as unknown as DeleteGameService;
    
    controller = new DeleteGameController(mockService);
    
    mockRequest = {
      params: {
        id: validGameId.toString()
      }
    };
    
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return 200 and deleted game data when validation and execution succeed', async () => {
      const mockGame = Game.create({
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
      }, validGameId);
      
      (dtos.validateDeleteGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: {
          gameId: validGameId
        }
      });
      
      mockExecute.mockResolvedValue(mockGame);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(dtos.validateDeleteGameDto).toHaveBeenCalledWith({
        gameId: validGameId
      });
      expect(mockExecute).toHaveBeenCalledWith({
        gameId: validGameId
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockGame);
    });

    it('should return 400 with validation errors when validation fails', async () => {
      const zodError = new ZodError([
        {
          code: 'custom',
          path: ['gameId'],
          message: 'Invalid game ID'
        }
      ]);
      
      (dtos.validateDeleteGameDto as jest.Mock).mockReturnValue({
        success: false,
        error: zodError
      });
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(dtos.validateDeleteGameDto).toHaveBeenCalledWith({
        gameId: validGameId
      });
      expect(mockExecute).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Validation error',
        errors: [{
          path: 'gameId',
          message: 'Invalid game ID'
        }]
      });
    });

    it('should return 400 when service returns ServiceError', async () => {
      const serviceError = new ServiceError('Game not found');
      
      (dtos.validateDeleteGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: {
          gameId: validGameId
        }
      });
      
      mockExecute.mockResolvedValue(serviceError);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalledWith({
        gameId: validGameId
      });
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: serviceError.message
      });
    });

    it('should return 500 when an unexpected error is thrown', async () => {
      const error = new Error('Unexpected error');
      
      (dtos.validateDeleteGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: {
          gameId: validGameId
        }
      });
      
      mockExecute.mockRejectedValue(error);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalledWith({
        gameId: validGameId
      });
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });

    it('should return HttpError status when an HttpError is thrown', async () => {
      const httpError = new HttpError('Not found', 404);
      
      (dtos.validateDeleteGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: {
          gameId: validGameId
        }
      });
      
      mockExecute.mockRejectedValue(httpError);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalledWith({
        gameId: validGameId
      });
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: httpError.message
      });
    });
  });
});
