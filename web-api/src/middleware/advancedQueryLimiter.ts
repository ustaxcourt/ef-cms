export const advancedQueryLimiter =
  ({ applicationContext, key }) =>
  async (req, res, next) => {
    const maxRequests = await applicationContext
      .getPersistenceGateway()
      .getLimiterByKey({ applicationContext, key: `${key}-configuration` });

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

    const windowTimeSecs = parseInt(windowTime / 1000);

    if (count > maxInvocations) {
      return res
        .set('Retry-After', windowTimeSecs)
        .status(429)
        .json({
          message: `you are only allowed ${maxInvocations} requests in a ${windowTimeSecs} second window time`,
          type: 'advanced-query-limiter',
        });
    }

    next();
  };
