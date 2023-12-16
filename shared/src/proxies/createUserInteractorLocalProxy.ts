import { post } from './requests';

/**
 * createUserInteractorLocalProxy
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the attributes of the user being created
 * @returns {Promise<*>} the promise of the api call
 */
export const createUserInteractorLocal = (applicationContext, { user }) => {
  return post({
    applicationContext,
    body: user,
    endpoint: '/users/local',
  });
};
