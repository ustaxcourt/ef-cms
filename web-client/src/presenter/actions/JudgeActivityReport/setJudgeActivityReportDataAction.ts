import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeActivityReportDataAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { casesClosedByJudge, trialSessions } = props;

  const { judgeName } = get(state.judgeActivityReport.filters);

  store.set(
    state.judgeActivityReport.judgeActivityReportData.casesClosedByJudge,
    casesClosedByJudge,
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData.trialSessions,
    trialSessions,
  );

  store.set(
    state.judgeActivityReport.filters.judgeNameToDisplayForHeader,
    judgeName,
  );
};
