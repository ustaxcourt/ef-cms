import { post } from '../requests';

export const renewIdTokenInteractor = (
  applicationContext,
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
