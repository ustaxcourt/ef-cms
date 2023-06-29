import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the state for the confirm edit modal
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setConfirmEditModalStateAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.modal.docketNumber, props.docketNumber);
  store.set(state.modal.docketEntryIdToEdit, props.docketEntryIdToEdit);
  store.set(state.modal.parentMessageId, props.parentMessageId);
};
