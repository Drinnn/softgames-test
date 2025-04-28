import { Request, Response } from 'express';
import { HttpError, ServiceError } from '../../entities';
import { validateAddGameDto } from './dtos';
import { AddGameService } from '../../services';
import { errorResponse, successResponse } from '../../utils';

export class AddGameController {
    constructor(private readonly addGameService: AddGameService) {}

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const validationResult = validateAddGameDto(request.body);
            
            if (!validationResult.success) {
                return errorResponse(response, validationResult.error);
            }
            
            const result = await this.addGameService.execute(validationResult.data);
            
            if (result instanceof ServiceError) {
                throw new HttpError(result.message, 400);
            }
            
            return successResponse(response, result, 201);
        } catch (error) {
            return errorResponse(response, error);
        }
    }
}