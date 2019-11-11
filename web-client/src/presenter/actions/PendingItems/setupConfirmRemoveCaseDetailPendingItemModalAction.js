import { state } from 'cerebral';

/**
 * set the modal state from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const setupConfirmRemoveCaseDetailPendingItemModalAction = ({
  props,
  store,
}) => {
  const { documentId } = props;

  store.set(state.modal.documentId, documentId);
};
