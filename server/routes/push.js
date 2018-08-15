import express from 'express';
import { publicKey, subscribe, notification } from '../controllers/push';
import { authenticate, validator } from '../helpers/utils';
import { subscribeRules, notificationRules } from '../models/User';

const router = express.Router();

router.get('/publicKey', publicKey);
router.put('/subscribe', validator(subscribeRules), authenticate, subscribe);
router.put('/notification', validator(notificationRules), authenticate, notification);

export default router;
