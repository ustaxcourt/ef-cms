import { state } from 'cerebral';

/**
 * Resets the pendingReports state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting pendingItems
 * @param {object} providers.props the pendingItems to set
 */
export const clearPendingReportsAction = ({ store }: ActionProps) => {
  store.set(state.pendingReports, {});
};
