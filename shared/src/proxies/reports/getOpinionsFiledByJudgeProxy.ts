import { OrdersAndOpinionTypes } from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getOpinionsFiledByJudgeInteractor = (
  applicationContext,
  {
    endDate,
    judgeName,
    startDate,
  }: { startDate: string; endDate: string; judgeName: string },
): Promise<OrdersAndOpinionTypes[]> => {
  return post({
    applicationContext,
    body: {
      endDate,
      judgeName,
      startDate,
    },
    endpoint: '/judge-activity-report/opinions',
  });
};
