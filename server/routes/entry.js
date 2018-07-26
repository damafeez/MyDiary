import express from 'express';
import {
  postEntry,
  getEntries,
  getEnry,
  editEntry,
  deleteEntry,
} from '../controllers/entries';

const router = express.Router();

router.post('/entries', postEntry);
router.get('/entries', getEntries);
router.get('/entries/:id', getEnry);
router.put('/entries/:id', editEntry);
router.delete('/entries/:id', deleteEntry);

export default router;
