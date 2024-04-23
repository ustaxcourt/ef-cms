import { get } from 'lodash';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { getUserFromAuthHeader } from '@web-api/middleware/apiGatewayHelper';

export const headerOverride = {
  'Access-Control-Expose-Headers': 'X-Terminal-User',
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  'Content-Type': 'application/json',
  Pragma: 'no-cache',
  Vary: 'Authorization',
  'X-Content-Type-Options': 'nosniff',
};

const defaultOptions: {
  isAsync?: boolean;
  isAsyncSync?: boolean;
} = {};

export const lambdaWrapper = (
  lambda,
  options = defaultOptions,
  applicationContext?: IApplicationContext,
) => {
  return async (req, res) => {
    // 'shouldMimicApiGatewayAsyncEndpoint' flag is set to mimic how API gateway async endpoints work locally.
    // When an async endpoint invoked in API gateway, the service immediately returns a 204 response with no body.
    // This behavior causes discrepancies between how these endpoints behave locally vs in a deployed AWS environment.
    const shouldMimicApiGatewayAsyncEndpoint =
      (options.isAsync || options.isAsyncSync) &&
      process.env.NODE_ENV != 'production';

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

    const { asyncsyncid } = req.headers;

    if (options.isAsyncSync && asyncsyncid && applicationContext) {
      const user = getUserFromAuthHeader(event);
      const fullResponse = {
        ...response,
        body: JSON.parse(response.body),
      };
      const responseString = JSON.stringify(fullResponse);
      const chunks = chunkString(responseString);
      const totalNumberOfChunks = chunks.length;
      for (let index = 0; index < totalNumberOfChunks; index++) {
        await applicationContext.getNotificationGateway().saveRequestResponse({
          applicationContext,
          chunk: chunks[index],
          index,
          requestId: asyncsyncid,
          totalNumberOfChunks,
          userId: user.userId,
        });
      }
    }

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

function chunkString(str) {
  const CHUNK_SIZE = 2000; //TODO: change it to more realistic size
  const chunkedArray: string[] = [];
  let index = 0;

  while (index < str.length) {
    chunkedArray.push(str.substring(index, index + CHUNK_SIZE));
    index += CHUNK_SIZE;
  }

  return chunkedArray;
}
