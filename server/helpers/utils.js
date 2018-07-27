const filterRequired = (requiredFields, body) => requiredFields
  .filter(field => Object.keys(body).indexOf(field) === -1)
  .reduce((acc, curr) => {
    return !acc ? `field ${curr} is required` : `${acc}, field ${curr} is required`;
  }, '');

const test = () => {
  console.log('test');
};

export { filterRequired, test };
