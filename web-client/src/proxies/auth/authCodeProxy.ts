import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const authCodeInteractor = (
  applicationContext: ClientApplicationContext,
  authCode: string,
): Promise<any> => {
  return post({
    applicationContext,
    body: {
      authCode,
    },
    endpoint: '/auth/code',
    options: {
      withCredentials: true,
    },
  });
};
