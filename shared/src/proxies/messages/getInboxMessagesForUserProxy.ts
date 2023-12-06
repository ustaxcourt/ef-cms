import { get } from '../requests';

/**
 * getInboxMessagesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user id
 * @returns {Promise<*>} the promise of the api call
 */
export const getInboxMessagesForUserInteractor = (
  applicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/inbox/${userId}`,
  });
};
