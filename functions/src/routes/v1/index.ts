import { createRouter } from '../../utils/router';
import { gamesRouter } from './games/index';

export const v1Router = createRouter();

v1Router.use('/games', gamesRouter);
