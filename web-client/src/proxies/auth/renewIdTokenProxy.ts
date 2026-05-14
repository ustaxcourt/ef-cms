import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const renewIdTokenInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<{
  idToken: string;
}> => {
  return post({
    applicationContext,
    body: '',
    endpoint: '/auth/refresh',
    options: {
      withCredentials: true,
    },
  });
};
