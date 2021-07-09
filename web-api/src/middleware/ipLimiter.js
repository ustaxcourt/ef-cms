const createApplicationContext = require('../applicationContext');

exports.ipLimiter = key => async (req, res, next) => {
  const MAX_COUNT = 15;
  const WINDOW_TIME = 60 * 1000;
  const applicationContext = createApplicationContext(null);
  const { sourceIp } = req.apiGateway.event.requestContext.identity;
  const KEY = `ip-limiter-${key}|${sourceIp}`;

  const limiterCache = await applicationContext
    .getPersistenceGateway()
    .incrementKeyCount({ applicationContext, key: KEY });

  let { expiresAt, id: count } = limiterCache;

  if (!expiresAt || Date.now() > expiresAt) {
    await applicationContext
      .getPersistenceGateway()
      .deleteKeyCount({ applicationContext, key: KEY });

    await applicationContext.getPersistenceGateway().setExpiresAt({
      applicationContext,
      expiresAt: Date.now() + WINDOW_TIME,
      key: KEY,
    });

    count = 1;
  }

  if (count > MAX_COUNT) {
    return res
      .set('Retry-After', 60)
      .status(429)
      .json({
        message: `you are only allowed ${MAX_COUNT} requests a minute`,
      });
  }

  next();
};
