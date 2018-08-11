import express from 'express';
import { postRules } from '../models/Diary';
import { validator, authenticate } from '../helpers/utils';
import {
  postEntry,
  getEntries,
  getEntry,
  editEntry,
  deleteEntry,
} from '../controllers/entries';

const router = express.Router();
router.post('/entries', validator(postRules), authenticate, postEntry);
router.get('/entries', authenticate, getEntries);
router.get('/entries/:id', authenticate, getEntry);
router.put('/entries/:id', validator(postRules), authenticate, editEntry);
router.delete('/entries/:id', authenticate, deleteEntry);

export default router;
