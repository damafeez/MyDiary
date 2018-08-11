import express from 'express';
import { publicKey, subscribe } from '../controllers/push';
import { authenticate, validator } from '../helpers/utils';
import { subscribeRules } from '../models/User';

const router = express.Router();

router.get('/publicKey', publicKey);
router.put('/subscribe', validator(subscribeRules), authenticate, subscribe);

export default router;
