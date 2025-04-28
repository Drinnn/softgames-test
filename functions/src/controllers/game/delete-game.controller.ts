import { Request, Response } from 'express';
import { HttpError, ServiceError } from "../../entities";
import { validateDeleteGameDto } from "./dtos";
import { DeleteGameService } from '../../services';
import { errorResponse, successResponse } from '../../utils';

export class DeleteGameController {
    constructor(private readonly deleteGameService: DeleteGameService) {}

    async handle(request: Request, response: Response): Promise<Response> {
        try {
            const gameId = Number(request.params.id);

            const validationResult = validateDeleteGameDto({
                gameId
            });

            if (!validationResult.success) {
                return errorResponse(response, validationResult.error);
            }

            const result = await this.deleteGameService.execute(validationResult.data);

            if (result instanceof ServiceError) {
                throw new HttpError(result.message, 400);
            }

            return successResponse(response, result, 200);
        } catch (error) {
            return errorResponse(response, error);
        }
    }
}