import { state } from 'cerebral';

/**
 * set the success message in props for successful document signing
 *
 * @param {object} params the params object
 * @param {Function} params.get the cerebral get function
 * @param {object} params.store the cerebral store
 * @returns {object} the props with the message
 */
export const setSuccessFromDocumentTitleAction = ({
  applicationContext,
  get,
  store,
}) => {
  const isCreatingOrder = get(state.isCreatingOrder);
  if (isCreatingOrder) {
    store.unset(state.isCreatingOrder);
    return {
      alertSuccess: {
        message:
          'Your document has been successfully created and attached to this message',
      },
    };
  }

  const { PROPOSED_STIPULATED_DECISION_EVENT_CODE } =
    applicationContext.getConstants();
  const { docketEntries } = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const order = docketEntries.find(d => d.docketEntryId === docketEntryId);

  let successMessage = `${order.documentTitle || order.documentType} updated.`;

  if (order.eventCode === PROPOSED_STIPULATED_DECISION_EVENT_CODE) {
    successMessage = 'Stipulated Decision signed and saved.';
  }

  return {
    alertSuccess: {
      message: successMessage,
    },
  };
};
