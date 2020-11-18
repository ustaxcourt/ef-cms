import { state } from 'cerebral';

/**
 * set the state for the delete notes modal
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setDeleteCaseNoteModalStateAction = ({ props, store }) => {
  store.set(state.modal.docketNumber, props.docketNumber);
};
