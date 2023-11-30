import { type AdminCreateUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { post } from './requests';

export const createUserCognitoInteractor = (
  applicationContext,
  { user },
): Promise<AdminCreateUserResponse> => {
  return post({
    applicationContext,
    body: user,
    endpoint: '/public-api/account/create',
  });
};
