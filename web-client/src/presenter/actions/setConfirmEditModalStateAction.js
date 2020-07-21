import { state } from 'cerebral';

/**
 * set the state for the confirm edit modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setConfirmEditModalStateAction = ({ props, store }) => {
  store.set(state.modal.docketNumber, props.docketNumber);
  store.set(state.modal.documentIdToEdit, props.documentIdToEdit);
  store.set(state.modal.caseId, props.caseId);
  store.set(state.modal.parentMessageId, props.parentMessageId);
};
