exports.createDone = callback => {
  return (err, res) =>
    callback(null, {
      statusCode: err ? err.statusCode || '400' : '200',
      body: err ? JSON.stringify(err.message) : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
};

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
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
