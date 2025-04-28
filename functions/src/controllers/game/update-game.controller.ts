import { Request, Response } from 'express';
import { HttpError, ServiceError } from '../../entities';
import { errorResponse, successResponse } from '../../utils';
import { validateUpdateGameDto } from './dtos';
import { UpdateGameService } from '../../services';

export class UpdateGameController {
    constructor(private readonly updateGameService: UpdateGameService) {}

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const gameId = Number(request.params.id);
            
            const validationResult = validateUpdateGameDto({
                ...request.body,
                gameId
            });
            
            if (!validationResult.success) {
                return errorResponse(response, validationResult.error);
            }
            
            const result = await this.updateGameService.execute(validationResult.data);
            
            if (result instanceof ServiceError) {
                throw new HttpError(result.message, 400);
            }
            
            return successResponse(response, result, 200);
        } catch (error) {
            return errorResponse(response, error);
        }
    }
}
