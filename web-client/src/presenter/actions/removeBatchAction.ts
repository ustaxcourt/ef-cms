import { state } from 'cerebral';

/**
 * removes the given batch from the current document scanning session
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function getting the batch to delete
 * @param {object} providers.store the cerebral store used for setting the new batch state
 * @returns {void}
 */

export const removeBatchAction = ({ get, store }) => {
  const batchIndexToDelete = get(state.scanner.batchIndexToDelete);
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  );
  const batches = get(state.scanner.batches[documentSelectedForScan]);
  const batchIndexToRemove = batches.findIndex(
    b => b.index === batchIndexToDelete,
  );
  batches.splice(batchIndexToRemove, 1);
  const previousIndex = Math.max(batchIndexToRemove - 1, 0);
  store.set(state.scanner.batches[documentSelectedForScan], batches);
  if (batches.length) {
    store.set(state.scanner.selectedBatchIndex, batches[previousIndex].index);
  } else {
    store.set(state.scanner.selectedBatchIndex, 0);
  }
};
