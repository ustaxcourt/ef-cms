const { get } = require('lodash');
const { getCurrentInvoke } = require('@vendia/serverless-express');

exports.headerOverride = {
  'Access-Control-Expose-Headers': 'X-Terminal-User',
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  'Content-Type': 'application/json',
  Pragma: 'no-cache',
  Vary: 'Authorization',
  'X-Content-Type-Options': 'nosniff',
};

exports.lambdaWrapper = lambda => {
  return async (req, res) => {
    // If you'd like to test the terminal user functionality locally, make this boolean true
    const currentInvoke = getCurrentInvoke();
    let isTerminalUser =
      get(currentInvoke, 'event.requestContext.authorizer.isTerminalUser') ===
      'true';

    const event = {
      headers: req.headers,
      isTerminalUser,
      path: req.path,
      pathParameters: req.params,
      queryStringParameters: req.query,
    };

    const response = await lambda({
      ...event,
      body: JSON.stringify(req.body),
      logger: req.locals.logger,
    });

    res.status(response.statusCode);

    res.set({
      ...response.headers,
      'X-Terminal-User': isTerminalUser,
      ...exports.headerOverride,
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
