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
