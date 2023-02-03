import { state } from 'cerebral';

/**
 * set the state for the delete notes modal
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setDeletePractitionerDocumentModalStateAction = ({
  props,
  store,
}) => {
  store.set(
    state.modal.practitionerDocumentFileId,
    props.practitionerDocumentFileId,
  );
  store.set(state.modal.barNumber, props.barNumber);
};
