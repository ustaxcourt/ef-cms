import { get } from '../requests';

/**
 * getMessageThreadInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @returns {Promise<*>} the promise of the api call
 */
export const getMessageThreadInteractor = (
  applicationContext,
  { parentMessageId },
) => {
  return get({
    applicationContext,
    endpoint: `/messages/${parentMessageId}`,
  });
};
