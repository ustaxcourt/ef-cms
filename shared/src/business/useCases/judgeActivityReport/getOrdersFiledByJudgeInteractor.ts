import {
  COURT_ISSUED_EVENT_CODES,
  ORDER_EVENT_CODES,
} from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { orderBy, without } from 'lodash';

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
  const orderEventCodesToSearch = without(
    ORDER_EVENT_CODES,
    excludedOrderEventCodes,
  );

  const { results } = await applicationContext
    .getPersistenceGateway()
    .advancedDocumentSearch({
      applicationContext,
      documentEventCodes: orderEventCodesToSearch,
      judge: searchEntity.judgeName,
    });

  // fix this
  let result = orderEventCodesToSearch.map(eventCode => {
    const count = results.filter(res => res.eventCode === eventCode).length;

    return {
      count,
      documentType: COURT_ISSUED_EVENT_CODES.find(
        doc => doc.eventCode === eventCode,
      )?.documentType,
      eventCode,
    };
  });

  result = result.filter(item => item.count > 0);

  const sortedResult = orderBy(result, 'eventCode', 'asc');

  return sortedResult;
};
