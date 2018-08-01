import Diary from '../models/Diary';
import { sendResponse } from '../helpers/utils';

export async function postEntry(request, response) {
  try {
    const { title, body } = request.body;
    const author = request.user;
    const newDiary = new Diary({ title, body, author });
    const diary = await newDiary.save();
    sendResponse({ response, data: diary, status: 201 });
  } catch (error) {
    sendResponse({ response, error: [error.message], status: 400 });
  }
}
export async function getEntries(request, response) {
  try {
    const entries = await Diary.find(request.user);
    sendResponse({ response, data: entries, status: 200 });
  } catch (error) {
    sendResponse({ response, error: [error.message], status: 400 });
  }
}
export async function getEntry(request, response) {
  try {
    const { id } = request.params;
    const entry = await Diary.findById(id);
    response.json({
      data: entry,
      error: null,
    });
  } catch (error) {
    response.status(404).json({
      data: {},
      error: error.message,
    });
  }
}
export async function editEntry(request, response) {
  try {
    const { title, body } = request.body;
    const diary = await Diary.findByIdAndUpdate(request.params.id, { title, body });
    response.json({
      data: diary,
      error: null,
    });
  } catch (error) {
    response.status(400).json({
      data: {},
      error: error.message,
    });
  }
}
export async function deleteEntry(request, response) {
  try {
    const { id } = request.params;
    const diary = await Diary.findByIdAndDelete(id);
    response.json({
      data: diary,
      error: null,
    });
  } catch (error) {
    response.status(400).json({
      data: {},
      error: error.message,
    });
  }
}
