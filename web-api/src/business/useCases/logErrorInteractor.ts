import { ServerApplicationContext } from '@web-api/applicationContext';

export const logErrorInteractor = (
  applicationContext: ServerApplicationContext,
  { error },
) => {
  applicationContext.logger.error(error);
};
