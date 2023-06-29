import { state } from '@web-client/presenter/app.cerebral';

/**
 * starts scanning documents based on current data source
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.path
 * @param {Function} providers.props the cerebral props object
 */
export const setSelectedBatchIndexAction = ({ props, store }: ActionProps) => {
  store.set(state.scanner.selectedBatchIndex, props.selectedBatchIndex);
};
