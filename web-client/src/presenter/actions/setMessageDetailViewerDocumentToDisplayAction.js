import { formatAttachments } from '../../../../shared/src/business/utilities/formatAttachments';
import { state } from 'cerebral';

/**
 * sets the message detail viewerDocumentToDisplay from props
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
  const { mostRecentMessage, viewerDocumentToDisplay } = props;
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;

  store.set(state.viewerDocumentToDisplay, viewerDocumentToDisplay);

  if (viewerDocumentToDisplay) {
    const { attachments } = mostRecentMessage;
    const formattedAttachments = formatAttachments({
      applicationContext,
      attachments,
      caseDetail,
    });
    const formattedAttachment = formattedAttachments.find(
      attachment =>
        attachment.docketEntryId === viewerDocumentToDisplay.docketEntryId,
    );

    if (!formattedAttachment.archived) {
      const {
        url,
      } = await applicationContext
        .getUseCases()
        .getDocumentDownloadUrlInteractor({
          applicationContext,
          docketNumber,
          isPublic: false,
          key: viewerDocumentToDisplay.docketEntryId,
        });

      store.set(state.iframeSrc, url);
    }
  }
};
