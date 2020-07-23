/**
 * gets the first attachment document from the most recent case message to set as the default viewerDocumentToDisplay
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultAttachmentViewerDocumentToDisplayAction = ({
  props,
}) => {
  const { documentId, mostRecentMessage } = props;
  const { attachments } = mostRecentMessage;
  let viewerDocumentToDisplay = null;

  if (attachments && attachments.length) {
    viewerDocumentToDisplay = attachments[0];

    if (documentId) {
      const foundDocument = attachments.find(
        attachment => attachment.documentId === documentId,
      );

      if (foundDocument) {
        viewerDocumentToDisplay = foundDocument;
      }
    }
  }

  return {
    viewerDocumentToDisplay,
  };
};
