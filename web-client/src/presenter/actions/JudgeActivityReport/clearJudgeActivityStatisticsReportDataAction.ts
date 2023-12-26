import { state } from '@web-client/presenter/app.cerebral';

export const clearJudgeActivityStatisticsReportDataAction = ({
  store,
}: ActionProps) => {
  store.set(
    state.judgeActivityReport.judgeActivityReportData.casesClosedByJudge,
    {},
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData.trialSessions,
    {},
  );

  store.set(state.judgeActivityReport.judgeActivityReportData.opinions, {});

  store.set(state.judgeActivityReport.judgeActivityReportData.orders, {});
};
