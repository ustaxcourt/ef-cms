import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.scanner.batchToDeletePageCount from props.batchPageCount
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.batchPageCount
 * @param {object} providers.store the cerebral store used for setting the state.batchPageCount
 */
export const setScannerBatchToDeletePageCountAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.scanner.batchToDeletePageCount, props.batchPageCount);
};
