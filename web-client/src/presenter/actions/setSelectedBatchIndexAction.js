import { state } from 'cerebral';

/**
 * starts scanning documents based on current data source
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.path
 * @param {Function} providers.props the cerebral props object
 */
export const setSelectedBatchIndexAction = async ({ props, store }) => {
  store.set(state.scanner.selectedBatchIndex, props.selectedBatchIndex);
};
