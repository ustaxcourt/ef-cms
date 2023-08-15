import {
  JudgeActivityReportFilters,
  OrdersReturnType,
} from '../../../../web-client/src/presenter/judgeActivityReportState';
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
