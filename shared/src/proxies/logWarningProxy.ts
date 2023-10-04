import { post } from './requests';

export const logWarningInteractor = (applicationContext, body) => {
  return post({
    applicationContext,
    body,
    endpoint: '/log/warning',
  });
};
