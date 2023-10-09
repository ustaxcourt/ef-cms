import { CavAndSubmittedFilteredCasesType } from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setCavAndSubmittedCasesAction = ({
  props,
  store,
}: ActionProps<{
  cases: CavAndSubmittedFilteredCasesType[];
}>) => {
  const { cases: submittedAndCavCasesByJudge } = props;

  store.set(
    state.judgeActivityReport.judgeActivityReportData
      .submittedAndCavCasesByJudge,
    submittedAndCavCasesByJudge,
  );
};
