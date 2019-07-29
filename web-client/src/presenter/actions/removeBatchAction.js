import { state } from 'cerebral';

export const removeBatchAction = async ({ get, props, store }) => {
  const { batchIndex } = props;
  const batches = get(state.batches);
  const batchIndexToRemove = batches.findIndex(b => b.index === batchIndex);
  batches.splice(batchIndexToRemove, 1);
  const previousIndex = Math.max(batchIndexToRemove - 1, 0);
  store.set(state.batches, batches);
  if (batches.length) {
    store.set(state.selectedBatchIndex, batches[previousIndex].index);
  } else {
    store.set(state.selectedBatchIndex, 0);
  }
};
