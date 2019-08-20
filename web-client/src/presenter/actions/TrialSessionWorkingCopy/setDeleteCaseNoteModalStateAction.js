import { state } from 'cerebral';

/**
 * set the state for the delete notes modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setDeleteCaseNoteModalStateAction = ({ props, store }) => {
  store.set(state.modal.caseId, props.caseId);
};
