import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeActivityReportDataAction = ({
  props,
  store,
}: ActionProps) => {
  const {
    cases: submittedAndCavCasesByJudge,
    casesClosedByJudge,
    consolidatedCasesGroupCountMap,
    lastDocketNumberForCavAndSubmittedCasesSearch,
    selectedPage,
    trialSessions,
  } = props;

  store.set(
    state.judgeActivityReport.judgeActivityReportData.casesClosedByJudge,
    casesClosedByJudge,
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData.trialSessions,
    trialSessions,
  );

  store.set(
    state.judgeActivityReport.lastIdsOfPages[selectedPage + 1],
    lastDocketNumberForCavAndSubmittedCasesSearch,
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData
      .consolidatedCasesGroupCountMap,
    consolidatedCasesGroupCountMap,
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData
      .submittedAndCavCasesByJudge,
    submittedAndCavCasesByJudge,
  );
};
