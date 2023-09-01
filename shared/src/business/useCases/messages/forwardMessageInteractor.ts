import { replyToMessage } from './replyToMessageInteractor';

/**
 * forwards a message
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {array} providers.attachments array of objects containing documentId and documentTitle
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.message the message text
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @param {string} providers.subject the message subject
 * @param {string} providers.toSection the section of the user receiving the message
 * @param {string} providers.toUserId the user id of the user receiving the message
 * @returns {object} the message
 */
export const forwardMessageInteractor = async (
  applicationContext,
  {
    attachments,
    docketNumber,
    draftAttachments,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  }: {
    attachments: any;
    docketNumber: string;
    draftAttachments: any;
    message: string;
    parentMessageId: string;
    subject: string;
    toSection: string;
    toUserId: string;
  },
) => {
  return await replyToMessage(applicationContext, {
    attachments,
    docketNumber,
    draftAttachments,
    message,
    parentMessageId,
    subject,
    toSection,
    toUserId,
  });
};
