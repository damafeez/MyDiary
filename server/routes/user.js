import express from 'express';
import { rules } from '../models/User';
import { validator } from '../helpers/utils';
import { signup } from '../controllers/user';

const router = express.Router();

router.post('/auth/signup', validator(rules), signup);

export default router;
