import User from '../models/User';
import { sendResponse } from '../helpers/utils';

const signup = async (request, response) => {
  try {
    const newUser = new User({ ...request.body });
    const user = await newUser.save();
    sendResponse({ response, data: user, status: 201 });
  } catch (error) {
    console.log(request.body);
    console.log(error.message);
    if (error.message === 'duplicate key value violates unique constraint "authentication_username_key"') error.message = 'username has been chosen';
    sendResponse({ response, error: [error.message], status: 400 });
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

export { signup, login };
