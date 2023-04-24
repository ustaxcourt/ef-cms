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
  const { PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP } =
    applicationContext.getConstants();

  const { primaryDocumentId } = props.documentsFiled;
  const { consolidatedCases, docketNumber } = get(state.caseDetail);
  const user = applicationContext.getCurrentUser();

  let { documentMetadata, fileAcrossConsolidatedGroup } = get(state.form);

  console.log('fileAcrossConsolidatedGroup', fileAcrossConsolidatedGroup);

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

  let consolidatedCasesDocketNumbers = [];

  if (fileAcrossConsolidatedGroup && consolidatedCases.length > 0) {
    console.log('inside if for fileAcrossConsolidatedGroup');

    consolidatedCasesDocketNumbers = consolidatedCases.map(
      individualCase => individualCase.docketNumber,
    );
  }

  console.log('consolidatedCasesDocketNumbers', consolidatedCasesDocketNumbers);

  const isDocumentWithImmediateAssociation =
    PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.filter(
      item => item.allowImmediateAssociation,
    )
      .map(item => item.eventCode)
      .includes(documentMetadata.eventCode);

  const isDocumentWithPendingAssociation =
    PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.filter(
      item => !item.allowImmediateAssociation,
    )
      .map(item => item.eventCode)
      .includes(documentMetadata.eventCode);

  if (isDocumentWithImmediateAssociation) {
    await applicationContext
      .getUseCases()
      .submitCaseAssociationRequestInteractor(applicationContext, {
        consolidatedCasesDocketNumbers,
        docketNumber,
        filers: documentMetadata.filers,
      });
  } else if (isDocumentWithPendingAssociation) {
    await applicationContext
      .getUseCases()
      .submitPendingCaseAssociationRequestInteractor(applicationContext, {
        docketNumber,
      });
  }

  console.log('leavinig submitCaseAssociationRequestAction');

  return {
    docketNumber,
    documentsFiled: documentMetadata,
  };
};
