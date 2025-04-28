import { Game, ServiceError } from "../entities";
import { GameRepository } from "./interfaces";

export type GetGameByIdServiceInput = {
    id: number;
}

export type GetGameByIdServiceOutput = Game | ServiceError;

export class GetGameByIdService {
    constructor(private readonly gameRepository: GameRepository) {}

    async execute(input: GetGameByIdServiceInput): Promise<GetGameByIdServiceOutput> {
        try {
            const game = await this.gameRepository.findById(input.id);
            if (!game) {
                return new ServiceError('Game not found');
            }
            
            return game;
        }
        catch (error) {
            return new ServiceError('Error getting game by id', error as Error);
        }
    }
}

