import express from 'express';
import Diary from '../model/Diary';

const router = express.Router();

router.get('/entries', async (req, res) => {
  try {
    const entries = await Diary.find();
    res.send(entries);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
export default router;
