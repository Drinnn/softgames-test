import { Request, Response } from 'express';
import { AddGameController } from './add-game.controller';
import { Game, GameType, HttpError, ServiceError } from '../../entities';
import * as dtos from './dtos';
import { ZodError } from 'zod';
import { AddGameService, AddGameServiceInput } from '../../services';

jest.mock('./dtos', () => ({
  validateAddGameDto: jest.fn()
}));

describe('AddGameController', () => {
  let mockExecute: jest.Mock;
  let mockService: AddGameService;
  let controller: AddGameController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  
  const validGameData: AddGameServiceInput = {
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
    mockExecute = jest.fn();
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockService = {
      execute: mockExecute
    } as unknown as AddGameService;
    
    controller = new AddGameController(mockService);
    
    mockRequest = {
      body: validGameData
    };
    
    mockResponse = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should return 201 and game data when validation and execution succeed', async () => {
      const mockGame = Game.create(validGameData);
      (dtos.validateAddGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: validGameData
      });
      mockExecute.mockResolvedValue(mockGame);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(dtos.validateAddGameDto).toHaveBeenCalledWith(mockRequest.body);
      expect(mockExecute).toHaveBeenCalledWith(validGameData);
      expect(mockStatus).toHaveBeenCalledWith(201);
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
      
      (dtos.validateAddGameDto as jest.Mock).mockReturnValue({
        success: false,
        error: zodError
      });
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(dtos.validateAddGameDto).toHaveBeenCalledWith(mockRequest.body);
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
      const serviceError = new ServiceError('Game already exists');
      (dtos.validateAddGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: validGameData
      });
      mockExecute.mockResolvedValue(serviceError);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalledWith(validGameData);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: serviceError.message
      });
    });

    it('should return 500 when an unexpected error is thrown', async () => {
      const error = new Error('Unexpected error');
      (dtos.validateAddGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: validGameData
      });
      mockExecute.mockRejectedValue(error);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalledWith(validGameData);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });

    it('should return HttpError status when an HttpError is thrown', async () => {
      const httpError = new HttpError('Not found', 404);
      (dtos.validateAddGameDto as jest.Mock).mockReturnValue({
        success: true,
        data: validGameData
      });
      mockExecute.mockRejectedValue(httpError);
      
      await controller.handle(mockRequest as Request, mockResponse as Response);
      
      expect(mockExecute).toHaveBeenCalledWith(validGameData);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: httpError.message
      });
    });
  });
});
