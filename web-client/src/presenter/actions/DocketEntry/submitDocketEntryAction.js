import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * submit a new docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitDocketEntryAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const documentId = get(state.documentId);
  const { primaryDocumentFileId } = props;

  const isFileAttached = !!primaryDocumentFileId;
  const isEditing = get(state.isEditingDocketEntry);

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    isFileAttached,
    isPaper: true,
    docketNumber,
    caseId,
    createdAt: applicationContext.getUtilities().createISODateString(),
    receivedAt: documentMetadata.dateReceived,
  };

  if (isFileAttached) {
    await applicationContext.getUseCases().virusScanPdfInteractor({
      applicationContext,
      documentId: primaryDocumentFileId,
    });

    await applicationContext.getUseCases().validatePdfInteractor({
      applicationContext,
      documentId: primaryDocumentFileId,
    });

    await applicationContext.getUseCases().sanitizePdfInteractor({
      applicationContext,
      documentId: primaryDocumentFileId,
    });
  }

  let caseDetail;

  if (isEditing) {
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
        primaryDocumentFileId:
          primaryDocumentFileId || applicationContext.getUniqueId(),
      });
  }

  if (isFileAttached) {
    const documentIdForFile = primaryDocumentFileId
      ? primaryDocumentFileId
      : documentId;

    await applicationContext.getUseCases().createCoverSheetInteractor({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId: documentIdForFile,
    });
  }

  return {
    caseDetail,
    caseId: docketNumber,
  };
};
