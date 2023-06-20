import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.scanner.batchIndexToRescan to the value of props.batchIndexToRescan
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing props.batchIndexToRescan
 * @param {object} providers.store the cerebral store used for setting the state.scanner.batchIndexToRescan
 */
export const setScannerBatchIndexToRescanAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.scanner.batchIndexToRescan, props.batchIndexToRescan);
};
