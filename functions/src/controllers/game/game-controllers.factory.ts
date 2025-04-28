import { AddGameController } from './add-game.controller';
import { AddGameService } from '../../services/add-game.service';
import { Request, Response } from 'express';
import { getGameRepository } from '../../repositories/firestore/game-repository.factory';

export const makeAddGameController = () => {
    const gameRepository = getGameRepository();
    const addGameService = new AddGameService(gameRepository);
    const controller = new AddGameController(addGameService);
    
    return async (req: Request, res: Response) => {
        return controller.handle(req, res);
    };
}; 