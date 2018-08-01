import User from '../models/User';
import { sendResponse } from '../helpers/utils';

export async function signup(request, response) {
  try {
    const {
      fullName,
      email,
      username,
      password,
    } = request.body;
    const newUser = new User({ ...request.body });
    const user = await newUser.save();
    sendResponse({ response, data: user, status: 201 });
  } catch (error) {
    sendResponse({ response, error: error.message, status: 400 });
  }
}

export async function login(request, response) {
  try {
    const {
      username,
      password,
    } = request.body;
    const returningUser = new User({ username, password });
    const user = await returningUser.login();
    sendResponse({ response, data: user });
  } catch (error) {
    sendResponse({ response, error: error.message, status: 401 });
  }
}
