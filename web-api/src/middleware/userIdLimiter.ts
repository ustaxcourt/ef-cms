import { createApplicationContext } from '../applicationContext';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { getUserFromAuthHeader } from './apiGatewayHelper';

export const userIdLimiter = key => async (req, res, next) => {
  const user = getUserFromAuthHeader(req);
  if (!user) return res.status(401).json({ message: 'auth header required' });
  const MAX_COUNT = parseInt(process.env.USER_LIMITER_THRESHOLD ?? '15');
  const WINDOW_TIME = parseInt(
    process.env.USER_LIMITER_WINDOW ?? `${60 * 1000}`,
  );
  const applicationContext = createApplicationContext();
  getLogger().addUser({ user });
  const KEY = `user-limiter-${key}|${user.userId}`;

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

  const windowTimeSecs = parseInt(WINDOW_TIME / 1000);

  if (count > MAX_COUNT) {
    return res
      .set('Retry-After', windowTimeSecs)
      .status(429)
      .json({
        message: `you are only allowed ${MAX_COUNT} requests in a ${windowTimeSecs} second window time`,
        type: 'user-id-limiter',
      });
  }

  next();
};
