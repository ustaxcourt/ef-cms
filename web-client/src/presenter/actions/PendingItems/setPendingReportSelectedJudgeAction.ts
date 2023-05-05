import { state } from 'cerebral';

/**
 * Sets the pending report selected judge
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting pendingItems
 * @param {object} providers.props the pendingItems to set
 */
export const setPendingReportSelectedJudgeAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.pendingReports, {
    hasPendingItemsResults: false,
    pendingItems: [],
    pendingItemsPage: 0,
  });
  store.set(state.pendingReports.selectedJudge, props.judge);
};
