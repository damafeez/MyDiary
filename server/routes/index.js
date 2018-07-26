import express from 'express';

import diary from './entry';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Server is live');
});
router.use(diary);
export default router;
