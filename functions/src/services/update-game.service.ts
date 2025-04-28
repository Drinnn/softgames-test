import { Game, GameType, ServiceError } from "../entities";
import { GameRepository } from "./interfaces";

export type UpdateGameServiceInput = {
    gameId?: number;
    name?: string;
    releaseYear?: number;
    players?: {
        min: number;
        max: number;
    };
    publisher?: string;
    expansions?: number[];
    standalone?: boolean;
    type?: GameType;
    baseGame?: number;
}

export type UpdateGameServiceOutput = Game | ServiceError;

export class UpdateGameService {
    constructor(private readonly gameRepository: GameRepository) {}

    async execute(input: UpdateGameServiceInput): Promise<UpdateGameServiceOutput> {
        try {
            const { gameId, name, releaseYear, players, publisher, expansions, standalone, type, baseGame } = input;

            if (!gameId) {
                return new ServiceError('Game ID is required');
            }

            const game = await this.gameRepository.findById(gameId);
    
            if (!game) {
                return new ServiceError('Game not found');
            }

            game.update({ name, releaseYear, players, publisher, expansions, standalone, type, baseGame });

            await this.gameRepository.save(game);

            return game;
        } catch (error) {
            return new ServiceError('Error updating game', error as Error);
        }
    }
}