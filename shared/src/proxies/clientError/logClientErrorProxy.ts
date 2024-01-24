import { post } from '../requests';

export const logClientErrorInteractor = (
  applicationContext,
  { error, method, status, url },
) => {
  return post({
    applicationContext,
    body: {
      error,
      method,
      status,
      url,
    },
    endpoint: '/client-error',
  });
};
