import { get } from 'lodash';
import { getCurrentInvoke } from '@vendia/serverless-express';

export const ipLimiter =
  ({ applicationContext, key }) =>
  async (req, res, next) => {
    const currentInvoke = getCurrentInvoke();

    const MAX_COUNT = parseInt(process.env.IP_LIMITER_THRESHOLD ?? '15');
    const WINDOW_TIME = parseInt(
      process.env.IP_LIMITER_WINDOW ?? `${60 * 1000}`,
    );
    const sourceIp = get(
      currentInvoke,
      'event.requestContext.identity.sourceIp',
    );
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

    const windowTimeSecs = parseInt(WINDOW_TIME / 1000);

    if (count > MAX_COUNT) {
      return res
        .set('Retry-After', windowTimeSecs)
        .status(429)
        .json({
          message: `you are only allowed ${MAX_COUNT} requests in a ${windowTimeSecs} second window time`,
          type: 'ip-limiter',
        });
    }

    next();
  };
