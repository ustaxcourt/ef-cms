import {
  CasesClosedType,
  JudgeActivityReportFilters,
} from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

/**
 * getCasesClosedByJudgeInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the end date for the report query
 * @param {string} providers.judgeName the judge name for the report query
 * @param {string} providers.startDate the start date for the report query
 * @returns {Promise<CasesClosedType>} the promise of the api call
 */
export const getCasesClosedByJudgeInteractor = (
  applicationContext,
  params: JudgeActivityReportFilters,
): Promise<CasesClosedType> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/closed-cases',
  });
};
