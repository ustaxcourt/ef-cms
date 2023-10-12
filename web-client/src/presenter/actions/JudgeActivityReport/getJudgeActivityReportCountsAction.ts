import {
  JUDGE_ACTIVITY_REPORT_ORDER_EVENT_CODES,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getJudgeActivityReportCountsAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);
  const eventCodes = [
    JUDGE_ACTIVITY_REPORT_ORDER_EVENT_CODES,
    OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ];

  const [orders, opinions] = await Promise.all(
    eventCodes.map(documentEventCodes =>
      applicationContext
        .getUseCases()
        .getCountOfCaseDocumentsFiledByJudgesInteractor(applicationContext, {
          documentEventCodes,
          endDate,
          judges,
          startDate,
        }),
    ),
  );

  return {
    opinions,
    orders,
  };
};
