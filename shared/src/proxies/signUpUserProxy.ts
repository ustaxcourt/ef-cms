import { type AdminCreateUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { post } from './requests';
import { SignUpUserResponse } from '@web-api/business/useCases/auth/signUpUserInteractor';

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
