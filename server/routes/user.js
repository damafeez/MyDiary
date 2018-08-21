import express from 'express';
import { signupRules, loginRules, editRules } from '../models/User';
import { validator, authenticate } from '../helpers/utils';
import { signup, login, edit } from '../controllers/user';

const router = express.Router();

router.post('/auth/signup', validator(signupRules), signup);
router.put('/auth/edit', authenticate, validator(editRules), edit);
router.post('/auth/login', validator(loginRules), login);

export default router;
