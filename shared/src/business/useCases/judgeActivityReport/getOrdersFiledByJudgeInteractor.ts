import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  MAX_ELASTICSEARCH_PAGINATION,
  ORDER_EVENT_CODES,
} from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { groupBy, orderBy } from 'lodash';

/**
 * getOrdersFiledByJudgeInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the date to end the search for judge activity
 * @param {string} providers.judgeName the name of the judge
 * @param {string} providers.startDate the date to start the search for judge activity
 * @returns {array} list of orders filed by the judge in the given date range, sorted alphabetically ascending by event code
 */
export const getOrdersFiledByJudgeInteractor = async (
  applicationContext,
  {
    endDate,
    judgeName,
    startDate,
  }: { judgeName: string; endDate: string; startDate: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judgeName,
    startDate,
  });

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
  const orderEventCodesToSearch = ORDER_EVENT_CODES.filter(
    eventCode => !excludedOrderEventCodes.includes(eventCode),
  );

  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodesToSearch,
      endDate: searchEntity.endDate,
      judge: searchEntity.judgeName,
      overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
      startDate: searchEntity.startDate,
    });

  let result = groupBy(results, 'eventCode');

  const formattedResult = Object.entries(result).map(([key, value]) => {
    return {
      count: value.length,
      documentType: value[0].documentType,
      eventCode: key,
    };
  });

  const sortedResult = orderBy(formattedResult, 'eventCode', 'asc');

  return sortedResult;
};
