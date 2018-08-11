import express from 'express';

import diary from './entry';
import user from './user';
import push from './push';

const router = express.Router();

router.get('/', (request, response) => {
  response.send('Server is live');
});
router.use('/push', push);
router.use(user);
router.use(diary);
export default router;
