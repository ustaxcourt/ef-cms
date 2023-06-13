import { OrdersAndOpinionTypes } from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getOrdersFiledByJudgeInteractor = (
  applicationContext,
  {
    endDate,
    judgesSelection,
    startDate,
  }: {
    startDate: string;
    endDate: string;
    judgesSelection: string[];
  },
): Promise<OrdersAndOpinionTypes[]> => {
  return post({
    applicationContext,
    body: {
      endDate,
      judgesSelection,
      startDate,
    },
    endpoint: '/judge-activity-report/orders',
  });
};
