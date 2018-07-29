import User from '../models/User';
import { filterRequired } from '../helpers/utils';

export async function signup(request, response) {
  const requiredFields = ['fullName', 'email', 'username', 'password'];
  try {
    const {
      fullName,
      email,
      username,
      password,
    } = request.body;
    if (fullName && email && username && password) {
      const newUser = new User({ ...request.body });
      const user = await newUser.save();
      response.status(201).json({
        data: user,
        error: null,
      });
    } else {
      const error = filterRequired(requiredFields, request.body);
      throw new Error(error);
    }
  } catch (error) {
    console.log({ error });
    response.status(400).json({
      data: {},
      error: error.message,
    });
  }
}
