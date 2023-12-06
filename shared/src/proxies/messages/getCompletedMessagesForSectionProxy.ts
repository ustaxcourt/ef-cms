import { get } from '../requests';

/**
 * getCompletedMessagesForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section
 * @returns {Promise<*>} the promise of the api call
 */
export const getCompletedMessagesForSectionInteractor = (
  applicationContext,
  { section },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/completed/section/${section}`,
  });
};
