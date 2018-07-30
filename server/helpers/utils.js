const validator = (rules) => {
  return (request, response, next) => {
    const error = Object.keys(rules).map((field) => {
      return rules[field].map(rule => rule[0](request.body[field], field, rule[1]));
    }).reduce((acc, curr) => [...acc, ...curr], []).filter(e => e !== true);
    if (error.length > 0) {
      return response.status(400).json({
        data: {},
        error,
      });
    }
    return next();
  };
};
const required = (v, field) => Boolean(v) || `${field} is required`;
const minLength = (v, field, min) => v && v.length >= min ? true : `${field} should have minimum of ${min} characters`;
const dataType = (v, field, type) => {
  if (v && type === 'email') {
    return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v) || `${field} should be of type ${type}`;
  }
  return typeof v === type || `${field} should be of type ${type}`;
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
  validator,
  required,
  minLength,
  dataType,
  sendResponse,
};
