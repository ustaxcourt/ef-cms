import { state } from '@web-client/presenter/app.cerebral';

export const checkJudgeActivityReportOpinionsAndOrdersIsSetAction = ({
  get,
  path,
}: ActionProps) => {
  const {
    casesClosedByJudge,
    opinions,
    orders,
    submittedAndCavCasesByJudge,
    trialSessions,
  } = get(state.judgeActivityReport.judgeActivityReportData);

  const isFullReportResolved = !!(
    opinions &&
    orders &&
    casesClosedByJudge &&
    trialSessions &&
    submittedAndCavCasesByJudge
  );

  if (isFullReportResolved) {
    return path.yes();
  } else return path.no();
};
