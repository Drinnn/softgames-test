import { Game, ServiceError } from "../entities";
import { GameRepository } from "./interfaces";

export type GetAllGamesServiceInput = void;
export type GetAllGamesServiceOutput = Game[] | ServiceError;

export class GetAllGamesService {
    constructor(private readonly gameRepository: GameRepository) {}

    async execute(): Promise<GetAllGamesServiceOutput> {
        try {
            const games = await this.gameRepository.findAll();
            return games;
        }
        catch (error) {
            return new ServiceError('Error getting all games', error as Error);
        }
    }
}
