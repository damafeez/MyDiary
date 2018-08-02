import express from 'express';
import { signupRules, loginRules } from '../models/User';
import { validator, authenticate } from '../helpers/utils';
import { signup, login, setNotification } from '../controllers/user';

const router = express.Router();

router.post('/auth/signup', validator(signupRules), signup);
router.post('/auth/login', validator(loginRules), login);
router.put('/notification', authenticate, setNotification);

export default router;
