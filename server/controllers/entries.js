import Diary from '../models/Diary';
import { filterRequired } from '../helpers/utils';

export async function postEntry(request, result) {
  const requiredFields = ['title', 'body', 'author'];
  try {
    const { title, body, author } = request.body;
    if (title && body && author) {
      const newDiary = new Diary({ title, body, author });
      const diary = await Diary.save(newDiary);
      result.json({
        body: diary,
        error: null,
      });
    } else {
      const error = filterRequired(requiredFields, request.body);
      throw new Error(error);
    }
  } catch (error) {
    result.status(400).json({
      body: {},
      error: error.message,
    });
  }
}
export async function getEntries(request, result) {
  try {
    const entries = await Diary.find();
    result.json({
      body: entries,
      error: null,
    });
  } catch (error) {
    result.status(404).json({
      body: {},
      error: error.message,
    });
  }
}
export async function getEntry(request, result) {
  try {
    const { id } = request.params;
    const entry = await Diary.findById(id);
    result.json({
      body: entry,
      error: null,
    });
  } catch (error) {
    result.status(404).json({
      body: {},
      error: error.message,
    });
  }
}
export async function editEntry(request, result) {
  try {
    const { title, body } = request.body;
    if (title && body) {
      const diary = await Diary.findByIdAndUpdate(request.params.id, { title, body });
      result.json({
        body: diary,
        error: null,
      });
    } else {
      throw new Error('all fields must be provided');
    }
  } catch (error) {
    result.status(400).json({
      body: {},
      error: error.message,
    });
  }
}
export async function deleteEntry(request, result) {
  try {
    const { id } = request.params;
    const diary = await Diary.findByIdAndDelete(id);
    result.json({
      body: diary,
      error: null,
    });
  } catch (error) {
    result.status(400).json({
      body: {},
      error: error.message,
    });
  }
}
