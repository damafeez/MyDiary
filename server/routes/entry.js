import express from 'express';
import { postRules, putRules } from '../models/Diary';
import { validator, authenticate } from '../helpers/utils';
import {
  postEntry,
  getEntries,
  getEntry,
  editEntry,
  deleteEntry,
} from '../controllers/entries';

const router = express.Router();
router.use(authenticate);
router.post('/entries', validator(postRules), postEntry);
router.get('/entries', getEntries);
router.get('/entries/:id', getEntry);
router.put('/entries/:id', validator(putRules), editEntry);
router.delete('/entries/:id', deleteEntry);

export default router;
