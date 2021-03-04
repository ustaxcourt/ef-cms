import { state } from 'cerebral';

/**
 * returns a callback function that sets documentType on state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting documentSelectedForScan
 */

export const setDocumentSelectedForScanAction = documentType =>
  /**
   * sets the value of state.currentViewMetadata.documentSelectedForScan entry to the value passed in
   *
   * @param {object} providers the providers object
   * @param {object} providers.store the cerebral store object
   */
  async ({ store }) => {
    store.set(state.currentViewMetadata.documentSelectedForScan, documentType);
  };
