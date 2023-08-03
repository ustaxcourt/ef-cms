import {
  JudgeActivityReportFilters,
  OrdersAndOpinionTypes,
} from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getOpinionsFiledByJudgeInteractor = (
  applicationContext,
  params: JudgeActivityReportFilters,
): Promise<OrdersAndOpinionTypes[]> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/async/judge-activity-report/opinions',
  });
};
