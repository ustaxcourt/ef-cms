import { CasesClosedReturnType } from '@shared/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { OpinionsReturnType } from '@shared/business/useCases/judgeActivityReport/getCountOfOpinionsFiledByJudgesInteractor';
import { OrdersReturnType } from '@shared/business/useCases/judgeActivityReport/getCountOfOrdersFiledByJudgesInteractor';
import { TrialSessionTypes } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const setJudgeActivityReportDataAction = ({
  props,
  store,
}: ActionProps<{
  casesClosedByJudge: CasesClosedReturnType;
  opinions: OpinionsReturnType;
  orders: OrdersReturnType;
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
