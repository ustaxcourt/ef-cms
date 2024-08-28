import { GetUserResponse } from '@shared/business/useCases/getUserInteractor';
import { get } from '../requests';

/**
 * getUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
export const getUserInteractor = (
  applicationContext,
): Promise<GetUserResponse> => {
  return get({
    applicationContext,
    endpoint: '/users',
  });
};
