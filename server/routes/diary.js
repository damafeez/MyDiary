import express from 'express';
import Diary from '../model/Diary';

const router = express.Router();

router.post('/entries', async (req, res) => {
  try {
    const { title, body, author } = req.body;
    if (title && body && author) {
      const newDiary = new Diary({ title, body, author });
      const diary = await Diary.save(newDiary);
      res.json(diary);
    } else {
      throw new Error('all fields must be provided');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get('/entries', async (req, res) => {
  try {
    const entries = await Diary.find();
    res.send(entries);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.get('/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Diary.findById(id);
    res.send(entry);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.put('/entries/:id', async (req, res) => {
  try {
    const { title, body } = req.body;
    if (title && body) {
      const diary = await Diary.findByIdAndUpdate(req.params.id, { title, body });
      res.send(diary);
    } else {
      throw new Error('all fields must be provided');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.delete('/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const diary = await Diary.findByIdAndDelete(id);
    res.send(diary);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
