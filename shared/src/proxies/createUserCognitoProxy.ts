import { type AdminCreateUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { CreateUserAlreadyExistsError } from '@shared/business/useCases/users/createUserCognitoInteractor';
import { post } from './requests';

export const createUserCognitoInteractor = (
  applicationContext,
  { user },
): Promise<AdminCreateUserResponse | CreateUserAlreadyExistsError> => {
  return post({
    applicationContext,
    body: user,
    endpoint: '/account/create',
  });
};
