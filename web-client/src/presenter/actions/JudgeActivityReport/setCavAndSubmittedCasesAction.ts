import { state } from '@web-client/presenter/app.cerebral';

export const setCavAndSubmittedCasesAction = ({ props, store }) => {
  const {
    cases: submittedAndCavCasesByJudge,
    consolidatedCasesGroupCountMap,
    totalCountForSubmittedAndCavCases,
  } = props;

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

  store.set(
    state.judgeActivityReport.judgeActivityReportData
      .totalCountForSubmittedAndCavCases,
    totalCountForSubmittedAndCavCases,
  );
};
