import { AddGameController } from './add-game.controller';
import { Request, Response } from 'express';
import { DeleteGameController } from './delete-game.controller';
import { GetAllGamesController } from './get-all-games.controller';
import { GetGameByIdController } from './get-game-by-id.controller';
import { UpdateGameController } from './update-game.controller';
import { AddGameService, DeleteGameService, GetAllGamesService, GetGameByIdService, UpdateGameService } from '../../services';
import { getGameRepository } from '../../repositories';

export const makeAddGameController = () => {
    const gameRepository = getGameRepository();
    const addGameService = new AddGameService(gameRepository);
    const controller = new AddGameController(addGameService);
    
    return async (req: Request, res: Response) => {
        return controller.handle(req, res);
    };
}; 

export const makeDeleteGameController = () => {
    const gameRepository = getGameRepository();
    const deleteGameService = new DeleteGameService(gameRepository);
    const controller = new DeleteGameController(deleteGameService);
    
    return async (req: Request, res: Response) => {
        return controller.handle(req, res);
    };
};

export const makeGetAllGamesController = () => {
    const gameRepository = getGameRepository();
    const getAllGamesService = new GetAllGamesService(gameRepository);
    const controller = new GetAllGamesController(getAllGamesService);
    
    return async (req: Request, res: Response) => {
        return controller.handle(req, res);
    };
};  

export const makeGetGameByIdController = () => {
    const gameRepository = getGameRepository();
    const getGameByIdService = new GetGameByIdService(gameRepository);
    const controller = new GetGameByIdController(getGameByIdService);
    
    return async (req: Request, res: Response) => {
        return controller.handle(req, res);
    };
};

export const makeUpdateGameController = () => {
    const gameRepository = getGameRepository();
    const updateGameService = new UpdateGameService(gameRepository);
    const controller = new UpdateGameController(updateGameService);
    
    return async (req: Request, res: Response) => {
        return controller.handle(req, res);     
    };
};