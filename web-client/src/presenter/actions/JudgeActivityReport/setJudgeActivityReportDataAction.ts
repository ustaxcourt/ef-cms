import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeActivityReportDataAction = ({
  props,
  store,
}: ActionProps) => {
  const { casesClosedByJudge, trialSessions } = props;

  store.set(
    state.judgeActivityReport.judgeActivityReportData.casesClosedByJudge,
    casesClosedByJudge,
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData.trialSessions,
    trialSessions,
  );
};
