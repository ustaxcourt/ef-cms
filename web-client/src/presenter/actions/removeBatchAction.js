import { state } from 'cerebral';

export const removeBatchAction = async ({ get, store }) => {
  const batchIndexToDelete = get(state.batchIndexToDelete);
  const documentSelectedForScan = get(state.documentSelectedForScan);
  const batches = get(state.batches[documentSelectedForScan]);
  const batchIndexToRemove = batches.findIndex(
    b => b.index === batchIndexToDelete,
  );
  batches.splice(batchIndexToRemove, 1);
  const previousIndex = Math.max(batchIndexToRemove - 1, 0);
  store.set(state.batches[documentSelectedForScan], batches);
  if (batches.length) {
    store.set(state.selectedBatchIndex, batches[previousIndex].index);
  } else {
    store.set(state.selectedBatchIndex, 0);
  }
};
