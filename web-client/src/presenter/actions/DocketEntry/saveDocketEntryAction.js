import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * saves and serves a new docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const saveDocketEntryAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const { primaryDocumentFileId } = props;
  const isFileAttached = get(state.form.primaryDocumentFile);
  const isUpdating = get(state.isEditingDocketEntry);
  const documentId =
    isFileAttached || primaryDocumentFileId
      ? primaryDocumentFileId
      : isUpdating
      ? get(state.documentId)
      : applicationContext.getUniqueId();

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    caseId,
    createdAt: documentMetadata.dateReceived,
    docketNumber,
    isFileAttached: !!isFileAttached,
    isPaper: true,
    receivedAt: documentMetadata.dateReceived,
  };

  if (isFileAttached) {
    await applicationContext.getUseCases().virusScanPdfInteractor({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().validatePdfInteractor({
      applicationContext,
      documentId,
    });
  }

  let caseDetail;

  if (isUpdating) {
    caseDetail = await applicationContext
      .getUseCases()
      .updateDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId: documentId,
      });
  } else {
    caseDetail = await applicationContext
      .getUseCases()
      .fileDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId: documentId,
      });
  }

  if (isFileAttached) {
    await applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId,
    });
  }

  return {
    caseDetail,
    caseId,
    docketNumber,
    overridePaperServiceAddress: true,
  };
};
