import { SignUpUserResponse } from '@web-api/business/useCases/auth/signUpUserInteractor';
import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const signUpUserInteractor = (
  applicationContext: ClientApplicationContext,
  { user },
): Promise<SignUpUserResponse> => {
  return post({
    applicationContext,
    body: user,
    endpoint: '/auth/account/create',
  });
};
