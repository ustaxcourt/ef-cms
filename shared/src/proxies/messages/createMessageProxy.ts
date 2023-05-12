import { post } from '../requests';

/**
 * createMessageInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.message the message text
 * @param {string} providers.subject the message subject
 * @param {string} providers.toSection the section of the user receiving the message
 * @param {string} providers.toUserId the user id of the user receiving the message
 * @returns {Promise<*>} the promise of the api call
 */
export const createMessageInteractor = (
  applicationContext,
  { attachments, docketNumber, message, subject, toSection, toUserId },
) => {
  return post({
    applicationContext,
    body: {
      attachments,
      docketNumber,
      message,
      subject,
      toSection,
      toUserId,
    },
    endpoint: '/messages/',
  });
};
