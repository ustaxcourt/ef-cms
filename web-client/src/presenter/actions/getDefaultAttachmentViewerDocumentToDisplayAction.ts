import { state } from '@web-client/presenter/app.cerebral';
/**
 * gets the first attachment document from the most recent message to set as the default messageViewerDocumentToDisplay
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing messageViewerDocumentToDisplay
 */
export const getDefaultAttachmentViewerDocumentToDisplayAction = ({
  get,
  props,
}: ActionProps) => {
  const viewerDocumentToDisplayFromState = get(
    state.messageViewerDocumentToDisplay,
  );

  let documentId = get(state.documentId);
  const { mostRecentMessage } = props;

  if (!documentId) {
    ({ documentId } = props);
  }

  const existingDocumentId = viewerDocumentToDisplayFromState?.documentId;

  if (
    viewerDocumentToDisplayFromState &&
    (!existingDocumentId ||
      (existingDocumentId && existingDocumentId === documentId))
  ) {
    return { messageViewerDocumentToDisplay: viewerDocumentToDisplayFromState };
  }

  const { attachments } = mostRecentMessage;
  let messageViewerDocumentToDisplay = null;

  if (attachments && attachments.length) {
    messageViewerDocumentToDisplay = attachments[0];

    if (documentId) {
      const foundDocument = attachments.find(
        attachment => attachment.documentId === documentId,
      );

      if (foundDocument) {
        messageViewerDocumentToDisplay = foundDocument;
      }
    }
  }

  return {
    messageViewerDocumentToDisplay,
  };
};
