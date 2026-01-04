import { state } from '@web-client/presenter/app.cerebral';

/**
 * removes the given batch from the current document scanning session
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function getting the batch to delete
 * @param {object} providers.store the cerebral store used for setting the new batch state
 * @returns {void}
 */

export const removeBatchAction = ({ get, store }: ActionProps) => {
  const batchIndexToDelete = get(state.scanner.batchIndexToDelete);
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  )!;
  const batches = get(state.scanner.batches[documentSelectedForScan]);

  if (!batches || batches.length === 0) {
    return;
  }

  const batchIndexToRemove = batches.findIndex(
    b => b.index === batchIndexToDelete,
  );

  if (batchIndexToRemove === -1) {
    return;
  }

  const selectedBatchIndex = get(state.scanner.selectedBatchIndex);
  const isSelectedBatchBeingDeleted = batchIndexToDelete === selectedBatchIndex;

  batches.splice(batchIndexToRemove, 1);
  store.set(state.scanner.batches[documentSelectedForScan], batches);

  if (isSelectedBatchBeingDeleted) {
    if (batches.length) {
      const previousIndex = Math.max(batchIndexToRemove - 1, 0);
      store.set(state.scanner.selectedBatchIndex, batches[previousIndex].index);
    } else {
      store.set(state.scanner.selectedBatchIndex, 0);
    }
  }
};
