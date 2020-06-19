/**
 * gets the first attachment document from the most recent case message to set as the default attachmentDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing attachmentDocumentToDisplay
 */
export const getDefaultAttachmentToDisplayAction = ({ props }) => {
  const { mostRecentMessage } = props;
  const { attachments } = mostRecentMessage;
  let attachmentDocumentToDisplay = null;

  if (attachments && attachments.length) {
    attachmentDocumentToDisplay = attachments[0];
  }

  return {
    attachmentDocumentToDisplay,
  };
};
