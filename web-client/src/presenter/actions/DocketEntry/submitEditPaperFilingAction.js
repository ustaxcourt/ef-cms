import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * calls interactor to edit a paper filing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitEditPaperFilingAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { isSavingForLater } = props;
  const docketEntryId = get(state.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    createdAt: documentMetadata.dateReceived,
    docketNumber,
    isFileAttached: !!isFileAttached,
    isPaper: true,
    receivedAt: documentMetadata.dateReceived,
  };

  const { paperServicePdfUrl } = await applicationContext
    .getUseCases()
    .editPaperFilingInteractor(applicationContext, {
      documentMetadata,
      isSavingForLater,
      primaryDocumentFileId: docketEntryId,
    });

  const generateCoversheet = isFileAttached && !isSavingForLater;
  if (generateCoversheet) {
    await applicationContext
      .getUseCases()
      .addCoversheetInteractor(applicationContext, {
        docketEntryId,
        docketNumber,
      });
  }

  return {
    pdfUrl: paperServicePdfUrl,
  };
};
