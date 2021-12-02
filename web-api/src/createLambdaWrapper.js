const { get } = require('lodash');
export const headerOverride = {
  'Access-Control-Expose-Headers': "['X-Terminal-User']",
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  'Content-Type': 'application/json',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
  'access-control-allow-credentials': 'true',
};

export const createLambdaWrapper = allowOrigin => lambda => {
  return async (req, res) => {
    // If you'd like to test the terminal user functionality locally, make this boolean true
    let isTerminalUser =
      get(req, 'apiGateway.event.requestContext.authorizer.isTerminalUser') ===
      'true';

    const event = {
      headers: req.headers,
      isTerminalUser,
      path: req.path,
      pathParameters: req.params,
      queryStringParameters: req.query,
    };

    req.setTimeout(20 * 60 * 1000); // 20 minute timeout (for async lambdas)

    const response = await lambda({
      ...event,
      body: JSON.stringify(req.body),
      logger: req.locals.logger,
    });

    res.status(response.statusCode);

    res.set({
      ...response.headers,
      'X-Terminal-User': isTerminalUser,
      ...headerOverride,
      'Access-Control-Allow-Origin': allowOrigin,
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
