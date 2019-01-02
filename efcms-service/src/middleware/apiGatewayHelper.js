const { UnauthorizedError, NotFoundError } = require('ef-cms-shared/src/errors/errors');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

exports.handle = async fun => {
  try {
    const response = await fun();
    return exports.sendOk(response);
  } catch (err) {
    console.error('err', err);
    if (err instanceof NotFoundError) {
      err.statusCode = 404;
      return exports.sendError(err);
    } else if (err instanceof UnauthorizedError) {
      err.statusCode = 403;
      return exports.sendError(err);
    } else {
      return exports.sendError(err);
    }

  }
};

exports.sendError = err => {
  return {
    statusCode: err.statusCode || '400',
    body: JSON.stringify(err.message),
    headers,
  };
};

exports.sendOk = (response, statusCode = '200') => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers,
  };
};

exports.getAuthHeader = event => {
  let usernameTokenArray;
  const authorizationHeader =
    event.headers &&
    (event.headers.Authorization || event.headers.authorization);
  if (authorizationHeader) {
    usernameTokenArray = authorizationHeader.split(' ');
    if (!usernameTokenArray || !usernameTokenArray[1]) {
      throw new UnauthorizedError(
        'Error: Authorization Bearer token is required',
      ); //temp until actual auth is added
    }
  } else {
    throw new UnauthorizedError('Error: Authorization is required'); //temp until actual auth is added
  }

  return usernameTokenArray[1];
};
