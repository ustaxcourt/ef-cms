import {
  JudgeActivityReportFilters,
  OrdersAndOpinionTypes,
} from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getOrdersFiledByJudgeInteractor = (
  applicationContext,
  { endDate, judgeName, startDate }: JudgeActivityReportFilters,
): Promise<OrdersAndOpinionTypes[]> => {
  return post({
    applicationContext,
    body: {
      endDate,
      judgeName,
      startDate,
    },
    endpoint: '/judge-activity-report/orders',
  });
};
