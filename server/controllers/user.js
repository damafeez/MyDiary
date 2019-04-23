import User from '../models/User';
import { sendResponse } from '../helpers/utils';

const signup = async (request, response) => {
  try {
    const newUser = new User({ ...request.body });
    const user = await newUser.save();
    sendResponse({ response, data: user, status: 201 });
  } catch (error) {
    sendResponse({ response, error: [error.message] });
  }
};

const edit = async (request, response) => {
  try {
    const user = await User.editProfile(request.user, request.body);
    sendResponse({ response, data: user });
  } catch (error) {
    sendResponse({ response, error: [error.message] });
  }
};

const imageUpdate = async (request, response) => {
  try {
    if (!request.files || !request.files.profileImage) throw new Error('Please upload valid image');
    const url = await User.editProfileImage(request.user, request.files.profileImage);
    sendResponse({ response, data: url });
  } catch (error) {
    sendResponse({ response, error: [error.message] });
  }
};

const changePassword = async (request, response) => {
  try {
    const user = await User.changePassword(request.user, request.body);
    sendResponse({ response, data: user });
  } catch (error) {
    sendResponse({ response, error: [error.message], status: 401 });
  }
};

const login = async (request, response) => {
  try {
    const {
      username,
      password,
    } = request.body;
    const returningUser = new User({ username, password });
    const user = await returningUser.login();
    sendResponse({ response, data: user });
  } catch (error) {
    sendResponse({ response, error: [error.message], status: 401 });
  }
};

export {
  signup,
  login,
  edit,
  imageUpdate,
  changePassword,
};
