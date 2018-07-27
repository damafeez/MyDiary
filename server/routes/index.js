import express from 'express';

import diary from './entry';
import user from './user';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Server is live');
});
router.use(diary);
router.use(user);
export default router;
