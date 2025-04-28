import { createRouter } from '../utils/router';
import { v1Router } from './v1/index';

const router = createRouter();

router.use('/v1', v1Router);

export default router;
