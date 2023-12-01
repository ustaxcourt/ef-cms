import { serverApplicationContext } from '../applicationContext';

/*
  This is no longer used, but we decided to keep it around for now.
*/
export const slowDownLimiter = key => async (req, res, next) => {
  const DELAY_TIME = 200;
  const WINDOW_TIME = 10000;
  const MAX_COUNT = 5;
  serverApplicationContext.setCurrentUser();
  const applicationContext = serverApplicationContext;

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
