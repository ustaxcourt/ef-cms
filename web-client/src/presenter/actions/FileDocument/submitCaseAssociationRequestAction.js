import { omit } from 'lodash';
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
  get,
  props,
  applicationContext,
}) => {
  const { docketNumber, caseId } = get(state.caseDetail);
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

  const caseDetail = await applicationContext
    .getUseCases()
    .fileExternalDocument({
      applicationContext,
      documentMetadata,
      primaryDocumentFileId,
      supportingDocumentFileId,
    });

  const documentWithImmediateAssociation = [
    'Entry of Appearance',
    'Substitution of Counsel',
  ].includes(documentMetadata.documentType);

  const documentWithPendingAssociation = [
    'Motion to Substitute Parties and Change Caption',
    'Notice of Intervention',
    'Notice of Election to Participate',
    'Notice of Election to Intervene',
  ].includes(documentMetadata.documentType);

  if (documentWithImmediateAssociation) {
    await applicationContext.getUseCases().submitCaseAssociationRequest({
      applicationContext,
      caseId,
    });
  } else if (documentWithPendingAssociation) {
    await applicationContext.getUseCases().submitPendingCaseAssociationRequest({
      applicationContext,
      caseId,
    });
  }

  for (let document of caseDetail.documents) {
    if (document.processingStatus === 'pending') {
      await applicationContext.getUseCases().virusScanPdf({
        applicationContext,
        documentId: document.documentId,
      });

      await applicationContext.getUseCases().validatePdf({
        applicationContext,
        documentId: document.documentId,
      });

      await applicationContext.getUseCases().sanitizePdf({
        applicationContext,
        documentId: document.documentId,
      });
      await applicationContext.getUseCases().createCoverSheet({
        applicationContext,
        caseId: caseDetail.caseId,
        documentId: document.documentId,
      });
    }
  }

  return {
    caseDetail,
    caseId: docketNumber,
    documentWithImmediateAssociation,
    documentWithPendingAssociation,
  };
};
