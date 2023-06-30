import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears all the scans sessions.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing the form
 */
export const clearScansAction = ({ store }: ActionProps) => {
  store.set(state.scanner.batches, {});
};
