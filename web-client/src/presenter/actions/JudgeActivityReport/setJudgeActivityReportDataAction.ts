import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { CasesClosedReturnType } from '@web-api/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { TrialSessionTypes } from '@web-api/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeActivityReportDataAction = ({
  props,
  store,
}: ActionProps<{
  casesClosedByJudge: CasesClosedReturnType;
  opinions: AggregatedEventCodesType;
  orders: AggregatedEventCodesType;
  trialSessions: TrialSessionTypes;
}>) => {
  const { casesClosedByJudge, opinions, orders, trialSessions } = props;

  store.set(
    state.judgeActivityReport.judgeActivityReportData.casesClosedByJudge,
    casesClosedByJudge,
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData.trialSessions,
    trialSessions,
  );

  store.set(
    state.judgeActivityReport.judgeActivityReportData.opinions,
    opinions,
  );

  store.set(state.judgeActivityReport.judgeActivityReportData.orders, orders);
};
