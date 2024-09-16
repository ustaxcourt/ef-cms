import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from './requests';

export const logErrorInteractor = (
  applicationContext: ClientApplicationContext,
  { error },
) => {
  return post({
    applicationContext,
    body: {
      error,
    },
    endpoint: '/logError/',
  });
};
