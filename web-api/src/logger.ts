/* eslint-disable @miovision/disallow-date/no-new-date */
import { cloneDeep, get } from 'lodash';
import { getCurrentInvoke } from '@vendia/serverless-express';
import { getLogger } from '@web-api/utilities/logger/getLogger';

export const expressLogger = (req, res, next) => {
  const logger = getLogger();
  if (process.env.NODE_ENV === 'production') {
    const requestBody = cloneDeep(req.body);

    if (requestBody) {
      redactPasswordFields(requestBody);
    }
    const currentInvoke = getCurrentInvoke();
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

  logger.debug(`Request started: ${req.method} ${req.url}`);

  req.locals = req.locals || {};
  req.locals.logger = logger;
  req.locals.startTime = new Date();

  const { end } = res;

  res.end = function () {
    end.apply(this, arguments);
    const responseTimeMs = new Date() - req.locals.startTime;

    logger.info(`Request ended: ${req.method} ${req.url}`, {
      response: {
        responseSize: parseInt(res.get('content-length') ?? '0'),
        responseTimeMs,
        statusCode: res.statusCode,
      },
    });
    logger.clearContext();
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
