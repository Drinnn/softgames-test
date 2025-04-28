import { GetGameByIdService } from "../../services";
import { errorResponse, successResponse } from "../../utils";
import { Request, Response } from "express";
import { validateGetGameByIdDto } from "./dtos";
import { HttpError, ServiceError } from "../../entities";
export class GetGameByIdController {
  constructor(private readonly getGameByIdService: GetGameByIdService) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const gameId = Number(request.params.id);

      const validationResult = validateGetGameByIdDto({
        gameId
      });

      if (!validationResult.success) {
        return errorResponse(response, validationResult.error);
      }

      const result = await this.getGameByIdService.execute(validationResult.data);

      if (result instanceof ServiceError) {
        throw new HttpError(result.message, 400);
      }

      return successResponse(response, result, 200);
    } catch (error) {
      return errorResponse(response, error);
    }
  }
}   