import { isEmpty, negate, omit } from 'lodash';
import { state } from 'cerebral';

/**
 * set practitioner to a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitCaseAssociationRequestAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const { primaryDocumentFileId, supportingDocumentFileId } = props;
  const user = get(state.user);

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    docketNumber,
    caseId,
    practitioner: [
      {
        ...user,
        partyPractitioner: documentMetadata.partyPractitioner,
      },
    ],
  };

  const documentIds = [primaryDocumentFileId, supportingDocumentFileId].filter(
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
      supportingDocumentFileId,
    });

  const documentWithImmediateAssociation = [
    'Entry of appearance',
    'Substitution of counsel',
  ].includes(documentMetadata.documentType);

  const documentWithPendingAssociation = [
    'Motion to substitute parties and change caption',
    'Notice of Intervention',
    'Notice of Election to Participate',
    'Notice of Election to Intervene',
  ].includes(documentMetadata.documentType);

  if (documentWithImmediateAssociation) {
    await applicationContext
      .getUseCases()
      .submitCaseAssociationRequestInteractor({
        applicationContext,
        caseId,
        representingPrimary: documentMetadata.representingPrimary,
        representingSecondary: documentMetadata.representingSecondary,
      });
  } else if (documentWithPendingAssociation) {
    await applicationContext
      .getUseCases()
      .submitPendingCaseAssociationRequestInteractor({
        applicationContext,
        caseId,
      });
  }

  const pendingDocuments = caseDetail.documents.filter(
    document => document.processingStatus === 'pending',
  );
  const addCoversheet = document => {
    return applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      caseId: caseDetail.caseId,
      documentId: document.documentId,
    });
  };
  await Promise.all(pendingDocuments.map(addCoversheet));

  return {
    caseDetail,
    caseId: docketNumber,
    documentWithImmediateAssociation,
    documentWithPendingAssociation,
  };
};
