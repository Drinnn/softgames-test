import { Game, GameType, ServiceError } from "../entities";
import { GameRepository } from "./interfaces";

export type AddGameServiceInput = {
    name: string;
    releaseYear: number;
    players: {
        min: number;
        max: number;
    };
    publisher: string;
    expansions: number[];
    standalone?: boolean;
    type: GameType;
    baseGame?: number;
}

export type AddGameServiceOutput = Game | ServiceError;



export class AddGameService {
    constructor(private readonly gameRepository: GameRepository) {}

    async execute(input: AddGameServiceInput): Promise<AddGameServiceOutput> {
        try {
            const game = Game.create(input);
            await this.gameRepository.save(game);
            return game;
        }
        catch (error) {
            return new ServiceError('Error adding game', error as Error);
        }
    }
}