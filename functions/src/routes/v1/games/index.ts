import { makeAddGameController, makeDeleteGameController, makeGetAllGamesController, makeGetGameByIdController, makeUpdateGameController } from '../../../controllers/game';
import { wrapAsync, createRouter } from '../../../utils/index';
export const gamesRouter = createRouter();

gamesRouter.post(
  '/',
  wrapAsync(makeAddGameController()),
);

gamesRouter.delete(
  '/:id',
  wrapAsync(makeDeleteGameController()),
);

gamesRouter.get(
  '/',
  wrapAsync(makeGetAllGamesController()),
);

gamesRouter.get(
  '/:id',
  wrapAsync(makeGetGameByIdController()),
);

gamesRouter.put(
  '/:id',
  wrapAsync(makeUpdateGameController()),
);