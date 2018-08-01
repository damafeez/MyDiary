import express from 'express';
import { postRules } from '../models/Diary';
import { validator } from '../helpers/utils';
import {
  postEntry,
  getEntries,
  getEntry,
  editEntry,
  deleteEntry,
} from '../controllers/entries';

const router = express.Router();

router.post('/entries', validator(postRules), postEntry);
router.get('/entries', getEntries);
router.get('/entries/:id', getEntry);
router.put('/entries/:id', validator(postRules), editEntry);
router.delete('/entries/:id', deleteEntry);

export default router;
