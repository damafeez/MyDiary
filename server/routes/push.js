import express from 'express';
import { publicKey, subscribe } from '../controllers/push';
import { authenticate } from '../helpers/utils';

const router = express.Router();

router.get('/publicKey', publicKey);
router.put('/subscribe', authenticate, subscribe);

export default router;
