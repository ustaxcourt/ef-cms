import { ServerApplicationContext } from '@web-api/applicationContext';

export const logOldLoginAttemptInteractor = (
  applicationContext: ServerApplicationContext,
): void => {
  applicationContext.logger.info('User attempted to login with legacy URL');
};
