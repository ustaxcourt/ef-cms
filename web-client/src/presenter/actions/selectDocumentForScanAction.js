import { state } from 'cerebral';

/**
 * selects a documentType to prepare it for scanning
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for knowing which work item was selected
 * @param {object} providers.props.documentType the document type which was selected
 * @param {object} providers.store the cerebral store object needed for setting the state.selectedWorkItems
 * @param {Function} providers.get the cerebral get function used for getting the state.selectedWorkItems
 * @returns {undefined} doesn't return anything
 */
export const selectDocumentForScanAction = ({ get, props, store }) => {
  const documentSelectedForScan = props.documentType;
  const batches = get(state.batches[documentSelectedForScan]) || [];
  store.set(state.batches[documentSelectedForScan], batches);
  store.set(state.currentPageIndex, 0);
  store.set(state.selectedBatchIndex, batches.length ? batches[0].index : 0);
  store.set(state.documentSelectedForScan, documentSelectedForScan);
};
