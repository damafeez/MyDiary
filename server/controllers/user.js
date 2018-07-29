import User, { rules } from '../models/User';

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
