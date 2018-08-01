import express from 'express';
import { signupRules, loginRules } from '../models/User';
import { validator } from '../helpers/utils';
import { signup, login } from '../controllers/user';

const router = express.Router();

router.post('/auth/signup', validator(signupRules), signup);
router.post('/auth/login', validator(loginRules), login);

export default router;
