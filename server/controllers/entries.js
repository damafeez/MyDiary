import Diary from '../models/Diary';

export async function postEntry(request, result) {
  const requiredFields = ['title', 'body', 'author'];
  try {
    const { title, body, author } = request.body;
    const newDiary = new Diary({ title, body, author });
    const diary = await Diary.save(newDiary);
    result.json({
      data: diary,
      error: null,
    });
  } catch (error) {
    result.status(400).json({
      data: {},
      error: error.message,
    });
  }
}
export async function getEntries(request, result) {
  try {
    const entries = await Diary.find();
    result.json({
      data: entries,
      error: null,
    });
  } catch (error) {
    result.status(404).json({
      data: {},
      error: error.message,
    });
  }
}
export async function getEntry(request, result) {
  try {
    const { id } = request.params;
    const entry = await Diary.findById(id);
    result.json({
      data: entry,
      error: null,
    });
  } catch (error) {
    result.status(404).json({
      data: {},
      error: error.message,
    });
  }
}
export async function editEntry(request, result) {
  try {
    const { title, body } = request.body;
    const diary = await Diary.findByIdAndUpdate(request.params.id, { title, body });
    result.json({
      data: diary,
      error: null,
    });
  } catch (error) {
    result.status(400).json({
      data: {},
      error: error.message,
    });
  }
}
export async function deleteEntry(request, result) {
  try {
    const { id } = request.params;
    const diary = await Diary.findByIdAndDelete(id);
    result.json({
      data: diary,
      error: null,
    });
  } catch (error) {
    result.status(400).json({
      data: {},
      error: error.message,
    });
  }
}
