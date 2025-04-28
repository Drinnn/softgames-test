import { HttpError } from "../../entities";
import { ServiceError } from "../../entities";
import { Request, Response } from "express";
import { GetAllGamesService } from "../../services";
import { errorResponse, successResponse } from "../../utils";

export class GetAllGamesController {
  constructor(private readonly getAllGamesService: GetAllGamesService) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const result = await this.getAllGamesService.execute();

      if (result instanceof ServiceError) {
        throw new HttpError(result.message, 400);
      }

      return successResponse(response, result, 200);
    } catch (error) {
      return errorResponse(response, error);
    }
  }
}       