const createApplicationContext = require('../applicationContext');

exports.slowDownLimiter = key => async (req, res, next) => {
  const DELAY_TIME = process.env.LIMITER_DELAY_TIME
    ? parseInt(process.env.LIMITER_DELAY_TIME)
    : 200;
  const WINDOW_TIME = process.env.LIMITER_WINDOW_TIME
    ? parseInt(process.env.LIMITER_WINDOW_TIME)
    : 10000;
  const MAX_COUNT = process.env.LIMITER_MAX_REQUESTS
    ? parseInt(process.env.LIMITER_MAX_REQUESTS)
    : 5;
  const applicationContext = createApplicationContext(null);

  const results = await applicationContext
    .getPersistenceGateway()
    .incrementKeyCount({ applicationContext, key });

  const { expiresAt, id: count } = results;

  const difference = Math.max(0, count - MAX_COUNT);

  if (!expiresAt || Date.now() > expiresAt) {
    await applicationContext
      .getPersistenceGateway()
      .deleteKeyCount({ applicationContext, key });

    await applicationContext.getPersistenceGateway().setExpiresAt({
      applicationContext,
      expiresAt: Date.now() + WINDOW_TIME,
      key,
    });
  }

  const extraDelay = difference * DELAY_TIME;

  setTimeout(next, extraDelay);
};
