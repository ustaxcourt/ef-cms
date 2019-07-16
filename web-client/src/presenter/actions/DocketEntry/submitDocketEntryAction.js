import { omit, pick } from 'lodash';
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
    documentId => documentId,
  );

  for (let documentId of documentIds) {
    if (documentId) {
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
    }
  }

  const caseDetail = await applicationContext
    .getUseCases()
    .fileExternalDocumentInteractor({
      applicationContext,
      documentMetadata,
      primaryDocumentFileId,
      secondaryDocumentFileId,
    });

  for (let document of caseDetail.documents) {
    if (document.processingStatus === 'pending') {
      await applicationContext.getUseCases().createCoverSheetInteractor({
        applicationContext,
        caseId: caseDetail.caseId,
        documentId: document.documentId,
      });
    }
  }

  return {
    caseDetail,
    caseId: docketNumber,
  };
};
