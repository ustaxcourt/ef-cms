import { get } from 'lodash';
import { getCurrentInvoke } from '@vendia/serverless-express';

export const headerOverride = {
  'Access-Control-Expose-Headers': 'X-Terminal-User',
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  'Content-Type': 'application/json',
  Pragma: 'no-cache',
  Vary: 'Authorization',
  'X-Content-Type-Options': 'nosniff',
};

export const lambdaWrapper = (lambda, options = {}) => {
  return async (req, res) => {
    // 'shouldMimicApiGatewayAsyncEndpoint' flag is set to mimic how API gateway async endpoints work locally.
    // When an async endpoint invoked in API gateway, the service immediately returns a 204 response with no body.
    // This behavior causes discrepancies between how these endpoints behave locally vs in a deployed AWS environment.
    const shouldMimicApiGatewayAsyncEndpoint =
      options.isAsync && process.env.NODE_ENV != 'production';

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

    if (shouldMimicApiGatewayAsyncEndpoint) {
      // we return immediately before we try running the lambda because that is how
      // the api gateway works with async endpoints.
      res.status(204).send('');
    }

    const response = await lambda({
      ...event,
      body: JSON.stringify(req.body),
      logger: req.locals.logger,
    });

    if (shouldMimicApiGatewayAsyncEndpoint) {
      // api gateway async endpoints do not care about the headers returned after we
      // run the lambda; therefore, we do nothing here.
      return;
    }

    res.status(parseInt(response.statusCode));

    res.set({
      ...response.headers,
      'X-Terminal-User': isTerminalUser,
      ...headerOverride,
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
