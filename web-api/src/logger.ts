/* eslint-disable @miovision/disallow-date/no-new-date */
import { cloneDeep, get } from 'lodash';
import { createLogger } from './createLogger';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { transports } from 'winston';

let cache;
const console = () =>
  cache ||
  (cache = new transports.Console({
    handleExceptions: true,
    handleRejections: true,
  }));

export const logger =
  (transport = console()) =>
  (req, res, next) => {
    const createdLogger = createLogger({ transports: [transport] });

    if (process.env.NODE_ENV === 'production') {
      const requestBody = cloneDeep(req.body);

      if (requestBody) {
        redactPasswordFields(requestBody);
      }
      const currentInvoke = getCurrentInvoke();
      createdLogger.defaultMeta = {
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
      };
    }

    createdLogger.debug(`Request started: ${req.method} ${req.url}`);

    req.locals = req.locals || {};
    req.locals.logger = createdLogger;
    req.locals.startTime = new Date();

    const { end } = res;

    res.end = function () {
      end.apply(this, arguments);
      const responseTimeMs = new Date() - req.locals.startTime;

      req.locals.logger.info(`Request ended: ${req.method} ${req.url}`, {
        response: {
          responseSize: parseInt(res.get('content-length') ?? '0'),
          responseTimeMs,
          statusCode: res.statusCode,
        },
      });
    };

    return next();
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
