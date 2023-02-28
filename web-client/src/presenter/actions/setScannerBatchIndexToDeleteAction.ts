import { state } from 'cerebral';

/**
 * sets the state.scanner.batchIndexToDelete from props.batchIndexToDelete
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.batchIndexToDelete
 * @param {object} providers.store the cerebral store used for setting the state.batchIndexToDelete
 */
export const setScannerBatchIndexToDeleteAction = ({ props, store }) => {
  store.set(state.scanner.batchIndexToDelete, props.batchIndexToDelete);
};
