import { JudgeActivityReportFilters } from 'shared/src/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { OrdersAndOpinionResultCountTypes } from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getOpinionsFiledByJudgeInteractor = (
  applicationContext,
  params: JudgeActivityReportFilters,
): Promise<OrdersAndOpinionResultCountTypes[]> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/opinions',
  });
};
