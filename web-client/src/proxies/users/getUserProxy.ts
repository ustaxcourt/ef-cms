import { GetUserResponse } from '@shared/business/useCases/getUserInteractor';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getUserInteractor = (
  applicationContext: ClientApplicationContext,
): Promise<GetUserResponse> => {
  return get({
    applicationContext,
    endpoint: '/users',
  });
};
