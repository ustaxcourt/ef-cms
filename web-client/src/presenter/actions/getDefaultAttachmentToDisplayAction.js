import { state } from 'cerebral';

/**
 * gets the first attachment document from the case message to set as the default attachmentDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @returns {object} object containing attachmentDocumentToDisplay
 */
export const getDefaultAttachmentToDisplayAction = ({ get }) => {
  const { attachments } = get(state.messageDetail)[0]; //todo in later task
  let attachmentDocumentToDisplay = null;

  if (attachments && attachments.length) {
    attachmentDocumentToDisplay = attachments[0];
  }

  return {
    attachmentDocumentToDisplay,
  };
};
