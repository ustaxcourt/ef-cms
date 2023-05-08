import { state } from 'cerebral';

/**
 * set the state for the delete user's notes modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setDeleteUserCaseNoteModalStateAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.modal.docketNumber, props.docketNumber);
};
