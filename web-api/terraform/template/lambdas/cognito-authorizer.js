const { createAuthorizer } = require('./createAuthorizer');

const getToken = event => {
  return event.headers?.authorization.substring(7);
};

exports.handler = createAuthorizer(getToken);
