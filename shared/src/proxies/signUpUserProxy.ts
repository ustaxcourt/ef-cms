import { SignUpUserResponse } from '@web-api/business/useCases/auth/signUpUserInteractor';
import { post } from './requests';

export const signUpUserInteractor = (
  applicationContext,
  { user },
): Promise<SignUpUserResponse> => {
  return post({
    applicationContext,
    body: user,
    endpoint: '/public-api/account/create',
  });
};
