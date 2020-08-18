import { formatAttachments } from '../../../../shared/src/business/utilities/formatAttachments';
import { state } from 'cerebral';

/**
 * sets the viewerDocumentToDisplay from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setViewerDocumentToDisplayAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { mostRecentMessage, viewerDocumentToDisplay } = props;
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;
  let shouldGetDocumentDownloadUrl = !!viewerDocumentToDisplay;

  store.set(state.viewerDocumentToDisplay, viewerDocumentToDisplay);

  if (mostRecentMessage) {
    const { attachments } = mostRecentMessage;
    const formattedAttachments = formatAttachments({ attachments, caseDetail });
    const formattedAttachment = formattedAttachments.find(
      attachment =>
        attachment.documentId === viewerDocumentToDisplay.documentId,
    );
    shouldGetDocumentDownloadUrl =
      viewerDocumentToDisplay && !formattedAttachment.archived;
  }

  if (shouldGetDocumentDownloadUrl) {
    const {
      url,
    } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor({
        applicationContext,
        docketNumber,
        documentId: viewerDocumentToDisplay.documentId,
        isPublic: false,
      });

    store.set(state.iframeSrc, url);
  }
};
