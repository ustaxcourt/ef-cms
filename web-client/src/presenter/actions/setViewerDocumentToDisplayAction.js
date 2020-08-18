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
  const { attachments } = mostRecentMessage;
  const { docketNumber } = caseDetail;

  store.set(state.viewerDocumentToDisplay, viewerDocumentToDisplay);

  const formattedAttachments = formatAttachments({ attachments, caseDetail });
  const formattedAttachment = formattedAttachments.find(
    attachment => attachment.documentId === viewerDocumentToDisplay.documentId,
  );

  if (viewerDocumentToDisplay && !formattedAttachment?.archived) {
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
