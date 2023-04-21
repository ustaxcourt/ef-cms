import { get } from '../requests';

/**
 * getPractitionersByNameProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.name the name to search by
 * @returns {Promise<*>} the promise of the api call
 */
export const getPractitionersByNameInteractor = (
  applicationContext,
  { name },
) => {
  return get({
    applicationContext,
    endpoint: '/practitioners',
    params: {
      name,
    },
  });
};
