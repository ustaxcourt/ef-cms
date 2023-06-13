import { OrdersAndOpinionTypes } from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

/**
 * getOrdersFiledByJudgeInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.endDate the report end date
 * @param {object} providers.judgeName the judgeName to query for
 * @param {object} providers.startDate the report start date
 * @returns {Promise<*>} the promise of the api call
 */
export const getOrdersFiledByJudgeInteractor = (
  applicationContext,
  {
    currentJudgesNames,
    endDate,
    judgeName,
    startDate,
  }: {
    startDate: string;
    endDate: string;
    judgeName: string;
    currentJudgesNames: string[];
  },
): Promise<OrdersAndOpinionTypes[]> => {
  return post({
    applicationContext,
    body: {
      currentJudgesNames,
      endDate,
      judgeName,
      startDate,
    },
    endpoint: '/judge-activity-report/orders',
  });
};
