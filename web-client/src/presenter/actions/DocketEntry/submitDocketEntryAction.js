import { isEmpty, negate, omit, pick } from 'lodash';
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
  const { primaryDocumentFileId, secondaryDocumentFileId } = props;

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile', 'secondaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    isPaper: true,
    docketNumber,
    caseId,
    createdAt: new Date().toISOString(),
    receivedAt: documentMetadata.dateReceived,
  };

  if (documentMetadata.secondaryDocument) {
    const COPY_PROPS = [
      'isPaper',
      'createdAt',
      'lodged',
      'partyPrimary',
      'partySecondary',
      'partyRespondent',
    ];

    documentMetadata.secondaryDocument = {
      ...documentMetadata.secondaryDocument,
      ...pick(documentMetadata, COPY_PROPS),
    };
  }

  const documentIds = [primaryDocumentFileId, secondaryDocumentFileId].filter(
    negate(isEmpty),
  );

  const makePdfSafe = async documentId => {
    await applicationContext.getUseCases().virusScanPdfInteractor({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().validatePdfInteractor({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().sanitizePdfInteractor({
      applicationContext,
      documentId,
    });
  };
  await Promise.all(documentIds.map(makePdfSafe));

  const caseDetail = await applicationContext
    .getUseCases()
    .fileDocketEntryInteractor({
      applicationContext,
      documentMetadata,
      primaryDocumentFileId,
      secondaryDocumentFileId,
    });

  const pendingDocuments = caseDetail.documents.filter(
    document => document.processingStatus === 'pending',
  );
  const createCoverSheetInteractor = document => {
    return applicationContext.getUseCases().createCoverSheetInteractor({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId: document.documentId,
    });
  };
  await Promise.all(pendingDocuments.map(createCoverSheetInteractor));

  return {
    caseDetail,
    caseId: docketNumber,
  };
};
