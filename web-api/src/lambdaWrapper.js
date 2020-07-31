export const lambdaWrapper = lambda => {
  return async (req, res) => {
    const event = {
      headers: req.headers,
      path: req.path,
      pathParameters: req.params,
      queryStringParameters: req.query,
    };

    if (process.env.USTC_ENV === 'dev') {
      console.log(`${req.method}: ${event.path}`);
    }

    const response = await lambda({
      ...event,
      body: JSON.stringify(req.body),
    });
    res.status(response.statusCode);
    if (
      ['application/pdf', 'text/html'].includes(
        response.headers['Content-Type'],
      )
    ) {
      res.send(response.body);
    } else if (response.headers['Content-Type'] === 'application/json') {
      res.json(JSON.parse(response.body || 'null'));
    } else if (response.headers.Location) {
      res.redirect(response.headers.Location);
    } else {
      console.log('ERROR: we do not support this return type');
    }
  };
};
