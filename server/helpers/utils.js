const validator = (rules) => {
  return (request, response, next) => {
    const error = Object.keys(rules).map((field) => {
      return rules[field].map(rule => rule[0](
        request.body[field],
        field,
        typeof rule[1] === 'string' ? rule[1].trim() : rule[1],
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
  validator,
  required,
  minLength,
  dataType,
  sendResponse,
};
