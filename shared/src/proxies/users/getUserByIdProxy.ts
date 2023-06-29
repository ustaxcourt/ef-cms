import { get } from '../requests';

/**
 * getUserInteractorById
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the id of the user to retrieve
 * @returns {Promise<*>} the promise of the api call
 */
export const getUserByIdInteractor = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}`,
  });
};
