import { state } from 'cerebral';

/**
 * @returns {Promise} async action
 */
export const setupConfirmWithPropsAction = ({ get }) => {
  const docketEntryIdToEdit = get(state.modal.docketEntryIdToEdit);
  const docketNumber = get(state.modal.docketNumber);
  const parentMessageId = get(state.modal.parentMessageId);
  const redirectUrl = get(state.redirectUrl);

  return {
    docketEntryIdToEdit,
    docketNumber,
    parentMessageId,
    redirectUrl,
  };
};
