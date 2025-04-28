import { createRouter } from '../../utils/router.js';
import { gamesRouter } from './games/index.js';

export const v1Router = createRouter();

v1Router.use('/games', gamesRouter);
