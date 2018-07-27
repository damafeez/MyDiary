import express from 'express';
import {
  postEntry,
  getEntries,
  getEntry,
  editEntry,
  deleteEntry,
} from '../controllers/entries';

const router = express.Router();

router.post('/entries', postEntry);
router.get('/entries', getEntries);
router.get('/entries/:id', getEntry);
router.put('/entries/:id', editEntry);
router.delete('/entries/:id', deleteEntry);

export default router;
