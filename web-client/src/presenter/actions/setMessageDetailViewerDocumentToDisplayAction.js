import { formatAttachments } from '../../../../shared/src/business/utilities/formatAttachments';
import { state } from 'cerebral';

const setPdfToDisplay = async (
  formattedAttachment,
  applicationContext,
  docketNumber,
  messageViewerDocumentToDisplay,
  store,
) => {
  if (!formattedAttachment.archived) {
    const { url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        isPublic: false,
        key: messageViewerDocumentToDisplay.documentId,
      });

    store.set(state.iframeSrc, url);
  }
};

const setAttachmentToDisplay = (
  applicationContext,
  messageViewerDocumentToDisplay,
  caseDetail,
  mostRecentMessage,
) => {
  const { attachments } = mostRecentMessage;

  const formattedAttachments = formatAttachments({
    applicationContext,
    attachments,
    caseDetail,
  });
  let formattedAttachment = formattedAttachments.find(
    attachment =>
      attachment.documentId === messageViewerDocumentToDisplay.documentId,
  );
  if (!formattedAttachment) {
    formattedAttachment = formattedAttachments[0];
    messageViewerDocumentToDisplay.documentId = formattedAttachment.documentId;
  }
  return formattedAttachment;
};

/**
 * sets the message detail messageViewerDocumentToDisplay from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setMessageDetailViewerDocumentToDisplayAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { messageViewerDocumentToDisplay, mostRecentMessage } = props;
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;

  store.set(
    state.messageViewerDocumentToDisplay,
    messageViewerDocumentToDisplay,
  );

  if (
    messageViewerDocumentToDisplay?.documentId &&
    mostRecentMessage.attachments?.length
  ) {
    const formattedAttachment = setAttachmentToDisplay(
      applicationContext,
      messageViewerDocumentToDisplay,
      caseDetail,
      mostRecentMessage,
    );

    await setPdfToDisplay(
      formattedAttachment,
      applicationContext,
      docketNumber,
      messageViewerDocumentToDisplay,
      store,
    );
  }
};
