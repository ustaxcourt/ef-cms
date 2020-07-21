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
}) => {
  const { caseId, docketNumber } = get(state.caseDetail);
  const user = applicationContext.getCurrentUser();

  let documentMetadata = get(state.form);

  documentMetadata = {
    ...documentMetadata,
    caseId,
    docketNumber,
    privatePractitioners: [
      {
        ...user,
        partyPrivatePractitioner: documentMetadata.partyPrivatePractitioner,
      },
    ],
  };

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

  return {
    caseId,
    docketNumber,
    documentWithImmediateAssociation,
    documentWithPendingAssociation,
    documentsFiled: documentMetadata,
  };
};
