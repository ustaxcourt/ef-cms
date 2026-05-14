import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from './requests';

export const logErrorInteractor = (
  applicationContext: ClientApplicationContext,
  { error },
): Promise<void> => {
  return post({
    applicationContext,
    body: {
      error,
    },
    endpoint: '/logError/',
  });
};
