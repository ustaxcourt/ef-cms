import { state } from '@web-client/presenter/app.cerebral';

// TODO: UPDATE UNIT TESTS
export const setJudgeActivityReportDataAction = ({
  props,
  store,
}: ActionProps) => {
  const { casesClosedByJudge, opinions, orders, trialSessions } = props;

  if (casesClosedByJudge) {
    store.set(
      state.judgeActivityReport.judgeActivityReportData.casesClosedByJudge,
      casesClosedByJudge,
    );
  }

  if (trialSessions) {
    store.set(
      state.judgeActivityReport.judgeActivityReportData.trialSessions,
      trialSessions,
    );
  }
  if (opinions) {
    store.set(
      state.judgeActivityReport.judgeActivityReportData.opinions,
      opinions,
    );
  }

  if (orders) {
    store.set(state.judgeActivityReport.judgeActivityReportData.orders, orders);
  }
};
