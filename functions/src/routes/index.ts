import { createRouter } from '../utils/router.js';
import { v1Router } from './v1/index.js';

const router = createRouter();

router.use('/v1', v1Router);

export default router;
