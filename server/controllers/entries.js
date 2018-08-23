import Diary from '../models/Diary';
import { sendResponse } from '../helpers/utils';

const postEntry = async (request, response) => {
  try {
    const { title, body } = request.body;
    const author = request.user;
    const newDiary = new Diary({ title, body, author });
    const diary = await newDiary.save();
    sendResponse({ response, data: diary, status: 201 });
  } catch (error) {
    sendResponse({ response, error: [error.message], status: 401 });
  }
};
const getEntries = async (request, response) => {
  const entries = await Diary.find(request.user);
  sendResponse({ response, data: entries });
};
const getEntry = async (request, response) => {
  try {
    const { id } = request.params;
    const diary = await Diary.findById(id, request.user);
    sendResponse({ response, data: diary });
  } catch (error) {
    sendResponse({ response, error: [error.message], status: 404 });
  }
};
const editEntry = async (request, response) => {
  try {
    const { title, body } = request.body;
    const diary = await Diary.findByIdAndUpdate(request.params.id, request.user, { title, body });
    sendResponse({ response, data: diary });
  } catch (error) {
    sendResponse({ response, error: [error.message], status: 404 });
  }
};
const deleteEntry = async (request, response) => {
  try {
    const diary = await Diary.findByIdAndDelete(request.params.id, request.user);
    sendResponse({ response, data: diary });
  } catch (error) {
    sendResponse({ response, error: [error.message], status: 404 });
  }
};

export {
  postEntry,
  getEntries,
  getEntry,
  editEntry,
  deleteEntry,
};
