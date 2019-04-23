import express from 'express';
import multiparty from 'connect-multiparty';
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
  imageUpdate,
  changePassword,
} from '../controllers/user';

const router = express.Router();
const multipart = multiparty();

router.post('/auth/signup', validator(signupRules), signup);
router.post('/auth/login', validator(loginRules), login);
router.put('/auth/edit', authenticate, validator(editRules), edit);
router.put('/auth/image', authenticate, multipart, imageUpdate);
router.put('/auth/password', authenticate, validator(passwordRules), changePassword);

export default router;
