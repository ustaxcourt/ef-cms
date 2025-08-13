import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { get } from 'lodash';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { getUserFromAuthHeader } from '@web-api/middleware/apiGatewayHelper';
import type { Context } from 'hono';

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
  lambda: (awsEvent: any, user?: UnknownAuthUser) => any,
  options = defaultOptions,
  applicationContext?: ServerApplicationContext,
) => {
  return async (c: Context) => {
    const shouldMimicApiGatewayAsyncEndpoint =
      (options.isAsync || options.isAsyncSync) &&
      process.env.NODE_ENV != 'production';

    let currentInvokeEvent: any = { queryStringParameters: {} };
    try {
      const { event } = getCurrentInvoke();
      currentInvokeEvent = event ?? currentInvokeEvent;
    } catch {
      // noop - getCurrentInvoke not available in this runtime
    }

    const isTerminalUser =
      get(currentInvokeEvent, 'requestContext.authorizer.isTerminalUser') ===
      'true';

    // Build API Gateway-like event
    const url = new URL(c.req.url);
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    const pathParameters = (c.req.param() as Record<string, string>) ?? {};
    const headers: Record<string, string> = {};
    for (const [key, value] of c.req.raw.headers) {
      headers[key.toLowerCase()] = value;
    }

    let bodyText = '';
    try {
      const cached = c.get('rawBody') as string | undefined;
      if (typeof cached === 'string') {
        bodyText = cached;
      } else {
        bodyText = await c.req.text();
      }
    } catch {
      bodyText = '';
    }

    const event = {
      headers,
      isTerminalUser,
      path: url.pathname,
      pathParameters,
      queryStringParameters: {
        ...currentInvokeEvent.queryStringParameters,
        ...queryParams,
      },
    };

    const user = getUserFromAuthHeader(event);

    const runLambda = async () => {
      const response = await lambda(
        {
          ...event,
          body: bodyText,
          logger: c.get('logger'),
        },
        user,
      );

      const { asyncsyncid } = headers as any;
      if (options.isAsyncSync && asyncsyncid && applicationContext && user) {
        try {
          const fullResponse = {
            ...response,
            body: response.body ? JSON.parse(response.body) : response.body,
          };
          const responseString = JSON.stringify(fullResponse);
          await applicationContext
            .getNotificationGateway()
            .saveRequestResponse({
              responseString,
              requestId: asyncsyncid,
              userId: user.userId,
            });
        } catch (errorAsyncSync) {
          console.log('Error: async sync if condition', errorAsyncSync);
        }
      }

      if (shouldMimicApiGatewayAsyncEndpoint) {
        // API Gateway async endpoints ignore downstream headers/body
        return null;
      }

      const status = parseInt(response.statusCode);
      const combinedHeaders = {
        ...response.headers,
        'X-Terminal-User': isTerminalUser,
        ...headerOverride,
      } as Record<string, string>;

      // Handle redirect
      if (response.headers?.Location) {
        // Hono's redirect accepts specific redirect status codes; default to 302
        const redirectStatus =
          status === 301 ||
          status === 302 ||
          status === 303 ||
          status === 307 ||
          status === 308
            ? (status as 301 | 302 | 303 | 307 | 308)
            : 302;
        return c.redirect(response.headers.Location, redirectStatus);
      }

      const contentType = response.headers?.['Content-Type'];
      if (contentType === 'application/json') {
        for (const [k, v] of Object.entries(combinedHeaders))
          c.header(k, String(v));
        const json = response.body ? JSON.parse(response.body) : null;
        c.status(status as any);
        return c.json(json);
      }

      if (
        contentType &&
        ['application/pdf', 'text/html'].includes(contentType)
      ) {
        for (const [k, v] of Object.entries(combinedHeaders))
          c.header(k, String(v));
        return new Response(response.body, {
          status,
          headers: combinedHeaders,
        });
      }

      console.log('ERROR: we do not support this return type');
      for (const [k, v] of Object.entries(combinedHeaders))
        c.header(k, String(v));
      c.status(status as any);
      return c.body(null);
    };

    if (shouldMimicApiGatewayAsyncEndpoint) {
      // Fire and forget the lambda execution
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      runLambda();
      c.header('X-Terminal-User', String(isTerminalUser));
      for (const [k, v] of Object.entries(headerOverride))
        c.header(k, String(v));
      c.status(204 as any);
      return c.body(null);
    }

    const result = await runLambda();
    if (result === null) {
      // already handled above as async
      c.status(204 as any);
      return c.body(null);
    }
    return result;
  };
};
