import { state } from '@web-client/presenter/app.cerebral';

export const clearJudgeActivityReportStatisticsFiltersAction = ({
  store,
}: ActionProps) => {
  store.set(state.judgeActivityReport.filters.startDate, '');
  store.set(state.judgeActivityReport.filters.endDate, '');
};
