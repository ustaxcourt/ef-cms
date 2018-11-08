exports.createDone = callback => {
  return (err, res) =>
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? JSON.stringify(err.message) : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
};

exports.getAuthHeader = event => {
  let usernameTokenArray;

  if (event['headers'] && event['headers']['Authorization']) {
    usernameTokenArray = event['headers']['Authorization'].split(" ");
    if (!usernameTokenArray || !usernameTokenArray[1]) {
       throw new Error('Error: Authorization Bearer token is required'); //temp until actual auth is added
    }

  } else {
    throw new Error('Error: Authorization is required'); //temp until actual auth is added
  }

  return usernameTokenArray[1];

};
