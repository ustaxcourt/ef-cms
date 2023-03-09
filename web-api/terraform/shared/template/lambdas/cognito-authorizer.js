const { createAuthorizer } = require('./createAuthorizer');

const getToken = event => {
  return event.authorizationToken.substring(7);
};

exports.handler = createAuthorizer(getToken);
