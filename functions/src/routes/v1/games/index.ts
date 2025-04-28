import { wrapAsync, createRouter } from '../../../utils/index.js';
import { getGames } from '../../../apis/firestore/games.js';

export const gamesRouter = createRouter();

gamesRouter.get(
  '/',
  wrapAsync(() => getGames()),
);
