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
export const areSelectedDocumentsMatchingAction = ({ get, path }) => {
  const documentSelectedForScan = get(state.documentSelectedForScan);
  const currentDocumentScanBatch = get(state.currentDocumentScanBatch);
  console.log(documentSelectedForScan, currentDocumentScanBatch);
  return documentSelectedForScan === currentDocumentScanBatch
    ? path.yes()
    : path.no();
};
