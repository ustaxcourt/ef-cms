import {
  JudgeActivityReportFilters,
  OrdersReturnType,
} from '@shared/business/useCases/judgeActivityReport/getCountOfOrdersFiledByJudgesInteractor';
import { post } from '../requests';

export const getCountOfOrdersFiledByJudgesInteractor = (
  applicationContext,
  params: JudgeActivityReportFilters,
): Promise<OrdersReturnType> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/orders',
  });
};
