/* eslint-disable @miovision/disallow-date/no-new-date */
const { createLogger } = require('../../shared/src/utilities/createLogger');
const { get } = require('lodash');
const { transports } = require('winston');

let cache;
const console = () =>
  cache ||
  (cache = new transports.Console({
    handleExceptions: true,
    handleRejections: true,
  }));

module.exports =
  (transport = console()) =>
  (req, res, next) => {
    const logger = createLogger({ transports: [transport] });

    if (process.env.NODE_ENV === 'production') {
      logger.defaultMeta = {
        environment: {
          color: process.env.CURRENT_COLOR || 'green',
          stage: process.env.STAGE || 'local',
        },
        request: {
          body: JSON.stringify(req.body),
          headers: req.headers,
          method: req.method,
          url: req.url,
        },
        requestId: {
          apiGateway: get(req, 'apiGateway.event.requestContext.requestId'),
          applicationLoadBalancer: req.get('x-amzn-trace-id'),
          lambda: get(req, 'apiGateway.context.awsRequestId'),
        },
      };
    }

    logger.debug(`Request started: ${req.method} ${req.url}`);

    req.locals = req.locals || {};
    req.locals.logger = logger;
    req.locals.startTime = new Date();

    const { end } = res;

    res.end = function () {
      end.apply(this, arguments);
      const responseTimeMs = new Date() - req.locals.startTime;

      req.locals.logger.info(`Request ended: ${req.method} ${req.url}`, {
        response: {
          responseTimeMs,
          statusCode: res.statusCode,
        },
      });
    };

    return next();
  };
