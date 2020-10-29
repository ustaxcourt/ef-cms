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

    res.set({
      'Access-Control-Allow-Origin': '*',
      'Cache-Control':
        'max-age=0, private, no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json',
      Pragma: 'no-cache',
      Vary: 'Authorization',
      'X-Content-Type-Options': 'nosniff',
    });

    if (
      ['application/pdf', 'text/html'].includes(
        response.headers['Content-Type'],
      )
    ) {
      res.set('Content-Type', response.headers['Content-Type']);
      res.send(response.body);
    } else if (response.headers['Content-Type'] === 'application/json') {
      res.send(JSON.parse(response.body || 'null'));
    } else if (response.headers.Location) {
      res.redirect(response.headers.Location);
    } else {
      console.log('ERROR: we do not support this return type');
    }
  };
};
