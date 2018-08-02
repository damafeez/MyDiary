import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticate = async (request, response, next) => {
  try {
    const token = request.headers['x-auth-token'];
    if (!token) throw new Error('token is required');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded.data;
    next();
  } catch (error) {
    response.status(401).json({
      data: {},
      error: [error.message],
    });
  }
};
const validator = (rules) => {
  return (request, response, next) => {
    request.body = Object.keys(request.body).reduce((accumulator, current) => {
      accumulator[current] = typeof request.body[current] === 'string' ? request.body[current].trim() : request.body[current];
      return accumulator;
    }, {});
    const error = Object.keys(rules).map((field) => {
      return rules[field].map(rule => rule[0](
        typeof request.body[field] === 'string' ? request.body[field].trim() : request.body[field],
        field,
        rule[1],
      ));
    })
      .reduce((accumulator, current) => [...accumulator, ...current], [])
      .filter(test => test !== true);
    if (error.length > 0) {
      return response.status(400).json({
        data: {},
        error,
      });
    }
    return next();
  };
};
const required = (inputField, field) => Boolean(inputField) || `${field} is required`;
const minLength = (inputField, field, min) => inputField && inputField.length >= min ? true : `${field} should have minimum of ${min} characters`;
const dataType = (inputField, field, type) => {
  if (inputField && type === 'email') {
    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(inputField) || `${field} should be of type ${type}`;
  }
  return typeof inputField === type || `${field} should be of type ${type}`;
};
const sendResponse = ({
  data = {},
  status = 200,
  error = null,
  response,
}) => {
  response.status(status).json({
    data,
    error,
  });
};

export {
  authenticate,
  validator,
  required,
  minLength,
  dataType,
  sendResponse,
};
