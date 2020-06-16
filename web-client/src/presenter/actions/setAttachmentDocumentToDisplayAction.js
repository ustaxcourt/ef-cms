import { state } from 'cerebral';

/**
 * sets the attachmentDocumentToDisplay from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const setAttachmentDocumentToDisplayAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const { attachmentDocumentToDisplay } = props;
  const { caseId } = get(state.caseDetail);

  store.set(state.attachmentDocumentToDisplay, attachmentDocumentToDisplay);

  if (attachmentDocumentToDisplay) {
    const {
      url,
    } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor({
        applicationContext,
        caseId,
        documentId: attachmentDocumentToDisplay.documentId,
        isPublic: false,
      });

    store.set(state.iframeSrc, url);
  }
};
