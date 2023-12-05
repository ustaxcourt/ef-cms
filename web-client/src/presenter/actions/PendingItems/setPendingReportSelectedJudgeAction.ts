import { state } from '@web-client/presenter/app.cerebral';

export const setPendingReportSelectedJudgeAction = ({
  props,
  store,
}: ActionProps<{ judge: string }>) => {
  store.set(state.pendingReports.selectedJudge, props.judge);
  store.set(state.pendingReports.hasPendingItemsResults, false);
  store.set(state.pendingReports.pendingItems, []);
  store.set(state.pendingReports.pendingItemsPage, 0);
};
