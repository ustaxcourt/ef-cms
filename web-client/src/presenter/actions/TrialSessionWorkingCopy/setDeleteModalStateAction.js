import { state } from 'cerebral';

/**
 * set the state for the delete confirm modal
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setDeleteModalStateAction = ({ props, store }) => {
  const { docketNumber } = props;

  store.set(state.modal.docketNumber, docketNumber);
};
