import { get } from '../requests';

/**
 * getOutboxMessagesForUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user id
 * @returns {Promise<*>} the promise of the api call
 */
export const getOutboxMessagesForUserInteractor = (
  applicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/outbox/${userId}`,
  });
};
