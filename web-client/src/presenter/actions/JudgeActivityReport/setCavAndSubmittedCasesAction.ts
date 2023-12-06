import { GetCasesByStatusAndByJudgeResponse } from '@shared/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setCavAndSubmittedCasesAction = ({
  props,
  store,
}: ActionProps<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}>) => {
  const { cases: submittedAndCavCasesByJudge } = props;

  store.set(
    state.judgeActivityReport.judgeActivityReportData
      .submittedAndCavCasesByJudge,
    submittedAndCavCasesByJudge,
  );
};
