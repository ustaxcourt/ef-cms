import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * creates a new, or updates an existing docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const saveDocketEntryAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const { isSavingForLater, primaryDocumentFileId } = props;
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;
  const isUpdating = get(state.isEditingDocketEntry);
  const generateCoversheet = isFileAttached && !isSavingForLater;

  let documentId;

  if (isUpdating) {
    documentId = get(state.documentId);
  } else if (isFileAttached) {
    documentId = primaryDocumentFileId;
  } else {
    documentId = applicationContext.getUniqueId();
  }

  let caseDetail;
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
    isUpdating,
    receivedAt: documentMetadata.dateReceived,
  };

  if (isFileAttachedNow) {
    await applicationContext.getUseCases().virusScanPdfInteractor({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().validatePdfInteractor({
      applicationContext,
      documentId,
    });
  }

  if (isUpdating) {
    caseDetail = await applicationContext
      .getUseCases()
      .updateDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        isSavingForLater,
        primaryDocumentFileId: documentId,
      });
  } else {
    caseDetail = await applicationContext
      .getUseCases()
      .fileDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        isSavingForLater,
        primaryDocumentFileId: documentId,
      });
  }

  if (generateCoversheet) {
    await applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      docketNumber: caseDetail.docketNumber,
      documentId,
    });
  }

  return {
    caseDetail,
    caseId,
    docketNumber,
    documentId,
    overridePaperServiceAddress: true,
  };
};
