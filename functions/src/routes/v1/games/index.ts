import { wrapAsync, createRouter } from '../../../utils/index';
import { getGames } from '../../../apis/firestore/games';

export const gamesRouter = createRouter();

gamesRouter.get(
  '/',
  wrapAsync(() => getGames()),
);
