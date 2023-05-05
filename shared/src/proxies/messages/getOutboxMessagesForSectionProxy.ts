import { get } from '../requests';

/**
 * getOutboxMessagesForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section
 * @returns {Promise<*>} the promise of the api call
 */
export const getOutboxMessagesForSectionInteractor = (
  applicationContext,
  { section },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/outbox/section/${section}`,
  });
};
