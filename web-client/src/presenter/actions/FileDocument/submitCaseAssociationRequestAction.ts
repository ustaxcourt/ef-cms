import { state } from '@web-client/presenter/app.cerebral';

/**
 * set practitioner to a case
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitCaseAssociationRequestAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP } =
    applicationContext.getConstants();

  const user = applicationContext.getCurrentUser();

  const { primaryDocumentId } = props.documentsFiled;

  const { docketNumber } = get(state.caseDetail);
  const form = get(state.form);

  const documentMetadata = {
    ...form,
    docketNumber,
    primaryDocumentId,
    privatePractitioners: [
      {
        ...user,
        partyPrivatePractitioner: form.partyPrivatePractitioner,
      },
    ],
  };

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

  return {
    docketNumber,
    documentsFiled: documentMetadata,
  };
};
