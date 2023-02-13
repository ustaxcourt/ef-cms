import { state } from 'cerebral';

/**
 * clears all the scans sessions.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const clearScansAction = ({ store }) => {
  store.set(state.scanner.batches, {});
};
