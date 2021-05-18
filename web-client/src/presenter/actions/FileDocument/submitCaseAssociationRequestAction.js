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
  const { primaryDocumentId } = props.documentsFiled;
  const { docketNumber } = get(state.caseDetail);
  const user = applicationContext.getCurrentUser();

  let documentMetadata = get(state.form);

  documentMetadata = {
    ...documentMetadata,
    docketNumber,
    primaryDocumentId,
    privatePractitioners: [
      {
        ...user,
        partyPrivatePractitioner: documentMetadata.partyPrivatePractitioner,
      },
    ],
  };

  const documentWithImmediateAssociation = [
    'Entry of Appearance',
    'Limited Entry of Appearance',
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
      .submitCaseAssociationRequestInteractor(applicationContext, {
        docketNumber,
        filers: documentMetadata.filers,
      });
  } else if (documentWithPendingAssociation) {
    await applicationContext
      .getUseCases()
      .submitPendingCaseAssociationRequestInteractor(applicationContext, {
        docketNumber,
      });
  }

  return {
    docketNumber,
    documentWithImmediateAssociation,
    documentWithPendingAssociation,
    documentsFiled: documentMetadata,
  };
};
