import express from 'express';
import {
  signupRules,
  loginRules,
  editRules,
  passwordRules,
} from '../models/User';
import {
  validator,
  authenticate,
} from '../helpers/utils';
import {
  signup,
  login,
  edit,
  changePassword,
} from '../controllers/user';

const router = express.Router();

router.post('/auth/signup', validator(signupRules), signup);
router.post('/auth/login', validator(loginRules), login);
router.put('/auth/edit', authenticate, validator(editRules), edit);
router.put('/auth/password', authenticate, validator(passwordRules), changePassword);

export default router;
