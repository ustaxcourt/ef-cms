const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

exports.redirect = async (fun, statusCode = 302) => {
  try {
    const { url } = await fun();
    return {
      statusCode,
      headers: {
        Location: url,
      },
    }
  } catch (err) {
    return exports.sendError(err);
  }
}

exports.handle = async fun => {
  try {
    const response = await fun();
    return exports.sendOk(response);
  } catch (err) {
    return exports.sendError(err);
  }
}

exports.sendError = err => {
  return {
    statusCode: err.statusCode || '400',
    body: JSON.stringify(err.message),
    headers
  }
};

exports.sendOk = (response, statusCode = '200') => {
  return {
    statusCode,
    body: JSON.stringify(response),
    headers
  }
};

exports.getAuthHeader = event => {
  let usernameTokenArray;

  if (event.headers && event.headers.Authorization) {
    usernameTokenArray = event.headers.Authorization.split(" ");
    if (!usernameTokenArray || !usernameTokenArray[1]) {
      throw new Error('Error: Authorization Bearer token is required'); //temp until actual auth is added
    }

  } else {
    throw new Error('Error: Authorization is required'); //temp until actual auth is added
  }

  return usernameTokenArray[1];

};
