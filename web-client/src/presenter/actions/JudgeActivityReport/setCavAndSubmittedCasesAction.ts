import { CavAndSubmittedFilteredCasesType } from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setCavAndSubmittedCasesAction = ({
  props,
  store,
}: ActionProps<{
  totalCountForSubmittedAndCavCases: number;
  cases: CavAndSubmittedFilteredCasesType[];
}>) => {
  const {
    cases: submittedAndCavCasesByJudge,
    totalCountForSubmittedAndCavCases,
  } = props;

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
