/* eslint-disable custom-rules-plugin/no-new-dates */
import { cloneDeep, get } from 'lodash';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export const requestLogger = async (c: any, next: any) => {
  const logger = getDawsonLogger();

  if (process.env.NODE_ENV === 'production') {
    let requestBody: any = undefined;
    try {
      // Attempt to parse JSON body for logging; also cache for downstream handlers
      const text = await c.req.text();
      c.set('rawBody', text);
      if (text) {
        try {
          requestBody = JSON.parse(text);
        } catch {
          requestBody = text;
        }
      }
    } catch (e) {
      // ignore body parsing issues for logging
    }

    if (requestBody && typeof requestBody === 'object') {
      redactPasswordFields(requestBody);
    }
    let currentInvoke: any = {};
    try {
      currentInvoke = getCurrentInvoke();
    } catch (e) {
      // ignore getCurrentInvoke failures outside lambda
    }
    logger.addContext({
      environment: {
        color: process.env.CURRENT_COLOR || 'green',
        stage: process.env.STAGE || 'local',
      },
      request: {
        body:
          typeof requestBody === 'string'
            ? requestBody
            : JSON.stringify(requestBody),
        headers: Object.fromEntries(c.req.raw.headers.entries()),
        method: c.req.method,
        url: c.req.url,
      },
      requestId: {
        apiGateway: get(currentInvoke, 'event.requestContext.requestId'),
        applicationLoadBalancer: c.req.header('x-amzn-trace-id'),
        lambda: get(currentInvoke, 'context.awsRequestId'),
      },
    });
  }

  logger.info(`Request started: ${c.req.method} ${c.req.url}`);

  c.set('logger', logger);
  c.set('startTime', new Date());

  await next();

  const startTime = c.get('startTime') as Date | undefined;
  const responseTimeMs = startTime
    ? new Date().getTime() - startTime.getTime()
    : 0;
  const contentLength = c.res.headers.get('content-length') ?? '0';

  logger.addContext({
    response: {
      responseSize: parseInt(contentLength),
      responseTimeMs,
      statusCode: c.res.status,
    },
  });

  logger.info(`Request ended: ${c.req.method} ${c.req.url}`);
  logger.clearContext();
};

function redactPasswordFields(obj) {
  const passwordRegex = /password/i;

  for (const key in obj) {
    if (typeof obj[key] === 'object' || Array.isArray(obj[key])) {
      redactPasswordFields(obj[key]);
    } else if (typeof key === 'string' && passwordRegex.test(key)) {
      obj[key] = '*** REDACTED ***';
    }
  }
}

// Backwards-compatible Express-style middleware for tests or legacy usage
export const expressLogger = (req: any, res: any, next: any) => {
  const logger = getDawsonLogger();
  if (process.env.NODE_ENV === 'production') {
    const requestBody = cloneDeep(req.body);

    if (requestBody) {
      redactPasswordFields(requestBody);
    }
    let currentInvoke: any = {};
    try {
      currentInvoke = getCurrentInvoke();
    } catch (e) {
      // ignore getCurrentInvoke failures outside lambda
    }
    logger.addContext({
      environment: {
        color: process.env.CURRENT_COLOR || 'green',
        stage: process.env.STAGE || 'local',
      },
      request: {
        body: JSON.stringify(requestBody),
        headers: req.headers,
        method: req.method,
        url: req.url,
      },
      requestId: {
        apiGateway: get(currentInvoke, 'event.requestContext.requestId'),
        applicationLoadBalancer: req.get('x-amzn-trace-id'),
        lambda: get(currentInvoke, 'context.awsRequestId'),
      },
    });
  }

  logger.info(`Request started: ${req.method} ${req.url}`);

  req.locals = req.locals || {};
  req.locals.logger = logger;
  req.locals.startTime = new Date();

  const { end } = res;

  res.end = function (this: any) {
    // eslint-disable-next-line prefer-rest-params
    end.apply(this, arguments as any);
    const responseTimeMs =
      new Date().getTime() - req.locals.startTime.getTime();

    logger.addContext({
      response: {
        responseSize: parseInt(res.get('content-length') ?? '0'),
        responseTimeMs,
        statusCode: res.statusCode,
      },
    });

    logger.info(`Request ended: ${req.method} ${req.url}`);
    logger.clearContext();
  } as any;

  return next();
};
