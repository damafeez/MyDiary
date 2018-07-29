import User from '../models/User';

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
    response.status(201).json({
      data: user,
      error: null,
    });
  } catch (error) {
    response.status(400).json({
      data: {},
      error: error.message,
    });
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
    response.status(200).header('x-auth-token', user.token).json({
      data: user,
      error: null,
    });
  } catch (error) {
    response.status(401).json({
      data: {},
      error: error.message,
    });
  }
}
