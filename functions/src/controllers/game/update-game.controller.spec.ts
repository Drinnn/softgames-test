import { Request, Response } from 'express';
import { UpdateGameController } from './update-game.controller';
import { UpdateGameService } from '../../services';
import { Game, GameType, HttpError, ServiceError } from '../../entities';
import * as dtos from './dtos';
import { ZodError } from 'zod';

jest.mock('./dtos', () => ({
  validateUpdateGameDto: jest.fn()
}));

describe('UpdateGameController', () => {
  let mockExecute: jest.Mock;
  let mockService: UpdateGameService;
  let controller: UpdateGameController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  
  const validGameId = 123;
  const validUpdateData = {
    name: 'Updated Catan',
    releaseYear: 1996,
    players: {
      min: 2,
      max: 5
    },
    publisher: 'New Publisher',
    expansions: [456, 789],
    standalone: true,
    type: GameType.BaseGame
  };

  beforeEach(() => {
    mockExecute = jest.fn();
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockService = {
      execute: mockExecute
    } as unknown as UpdateGameService;
    
    controller = new UpdateGameController(mockService);
    
    mockRequest = {
      body: validUpdateData,
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
    it('should return 200 and updated game data when validation and execution succeed', async () => {
      const mockGame = Game.create(validUpdateData, validGameId);
      
      (dtos.validateUpdateGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: {
          ...validUpdateData,
          gameId: validGameId
        }
      });
      
      mockExecute.mockResolvedValue(mockGame);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(dtos.validateUpdateGameDto).toHaveBeenCalledWith({
        ...validUpdateData,
        gameId: validGameId
      });
      expect(mockExecute).toHaveBeenCalledWith({
        ...validUpdateData,
        gameId: validGameId
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockGame);
    });

    it('should return 400 with validation errors when validation fails', async () => {
      const zodError = new ZodError([
        {
          code: 'custom',
          path: ['name'],
          message: 'Name is required'
        }
      ]);
      
      (dtos.validateUpdateGameDto as jest.Mock).mockReturnValue({
        success: false,
        error: zodError
      });
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(dtos.validateUpdateGameDto).toHaveBeenCalledWith({
        ...validUpdateData,
        gameId: validGameId
      });
      expect(mockExecute).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Validation error',
        errors: [{
          path: 'name',
          message: 'Name is required'
        }]
      });
    });

    it('should return 400 when service returns ServiceError', async () => {
      const serviceError = new ServiceError('Game not found');
      
      (dtos.validateUpdateGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: {
          ...validUpdateData,
          gameId: validGameId
        }
      });
      
      mockExecute.mockResolvedValue(serviceError);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalledWith({
        ...validUpdateData,
        gameId: validGameId
      });
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: serviceError.message
      });
    });

    it('should return 500 when an unexpected error is thrown', async () => {
      const error = new Error('Unexpected error');
      
      (dtos.validateUpdateGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: {
          ...validUpdateData,
          gameId: validGameId
        }
      });
      
      mockExecute.mockRejectedValue(error);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalledWith({
        ...validUpdateData,
        gameId: validGameId
      });
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });

    it('should return HttpError status when an HttpError is thrown', async () => {
      const httpError = new HttpError('Not found', 404);
      
      (dtos.validateUpdateGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: {
          ...validUpdateData,
          gameId: validGameId
        }
      });
      
      mockExecute.mockRejectedValue(httpError);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalledWith({
        ...validUpdateData,
        gameId: validGameId
      });
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: httpError.message
      });
    });
  });
});
