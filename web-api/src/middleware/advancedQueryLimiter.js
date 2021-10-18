const createApplicationContext = require('../applicationContext');

exports.advancedQueryLimiter = key => async (req, res, next) => {
  const applicationContext = createApplicationContext(null);

  const maxRequests = await applicationContext
    .getPersistenceGateway()
    .getLimiterByKey({ applicationContext, key });

  const { maxInvocations, windowTime } = maxRequests;

  const limiterCache = await applicationContext
    .getPersistenceGateway()
    .incrementKeyCount({ applicationContext, key });

  let { expiresAt, id: count } = limiterCache;

  if (!expiresAt || Date.now() > expiresAt) {
    await applicationContext
      .getPersistenceGateway()
      .deleteKeyCount({ applicationContext, key });

    await applicationContext.getPersistenceGateway().setExpiresAt({
      applicationContext,
      expiresAt: Date.now() + windowTime,
      key,
    });

    count = 1;
  }

  if (count > maxInvocations) {
    return res
      .set('Retry-After', parseInt(windowTime / 1000))
      .status(429)
      .json({
        message: `you are only allowed ${maxInvocations} requests per ${windowTime}ms`,
      });
  }

  next();
};
