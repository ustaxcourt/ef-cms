import { post } from './requests';

/**
 * createUserCognitoProxy
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the attributes of the user being created
 * @returns {Promise<*>} the promise of the api call
 */
export const createUserCognitoInteractor = (applicationContext, { user }) => {
  return post({
    applicationContext,
    body: user,
    endpoint: '/users/local',
  });
};
