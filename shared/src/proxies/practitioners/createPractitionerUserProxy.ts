import { post } from '../requests';

/**
 * createPractitionerUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.user the user data
 * @returns {Promise<object>} the created user data
 */
export const createPractitionerUserInteractor = (
  applicationContext,
  { user },
) => {
  return post({
    applicationContext,
    body: { user },
    endpoint: '/practitioners',
  });
};
