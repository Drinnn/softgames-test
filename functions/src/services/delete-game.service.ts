import { Game, ServiceError } from "../entities";
import { GameRepository } from "./interfaces";
export type DeleteGameServiceInput = {
    gameId: number;
}

export type DeleteGameServiceOutput = Game | ServiceError;

export class DeleteGameService {
    constructor(private readonly gameRepository: GameRepository) {

    }

    async execute(input: DeleteGameServiceInput): Promise<DeleteGameServiceOutput> {
        try {
            const game = await this.gameRepository.findById(input.gameId);
            if (!game) {
                return new ServiceError('Game not found');
            }
            await this.gameRepository.delete(game);
            return game;
        }
        catch (error) {
            return new ServiceError('Error deleting game', error as Error);
        }
    }
}