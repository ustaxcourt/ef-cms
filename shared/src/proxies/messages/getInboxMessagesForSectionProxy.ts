import { get } from '../requests';

/**
 * getInboxMessagesForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section
 * @returns {Promise<*>} the promise of the api call
 */
export const getInboxMessagesForSectionInteractor = async (
  applicationContext,
  { section },
) => {
  console.log('wtfff', applicationContext.getMessagesServiceUrl);
  console.log('we are here', applicationContext.getMessagesServiceUrl());
  return get({
    applicationContext,
    baseUrl: applicationContext.getMessagesServiceUrl(),
    endpoint: `/messages/inbox/section/${section}`,
  });
};
