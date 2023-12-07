const { createAuthorizer } = require('./createAuthorizer');

const getToken = event => {
  return event.queryStringParameters && event.queryStringParameters.token;
};

exports.handler = createAuthorizer(getToken);
