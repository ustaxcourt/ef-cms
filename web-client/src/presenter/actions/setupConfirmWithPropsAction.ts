import { state } from '@web-client/presenter/app.cerebral';

/**
 * @returns {Promise} async action
 */
export const setupConfirmWithPropsAction = ({ get }: ActionProps) => {
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
