import { Game } from "../../entities";

export interface GameRepository {
    save(game: Game): Promise<Game>;
    findById(id: number): Promise<Game | null>;
    findAll(): Promise<Game[]>;
    delete(game: Game): Promise<void>;
}