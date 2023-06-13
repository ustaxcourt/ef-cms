import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  MAX_ELASTICSEARCH_PAGINATION,
  ORDER_EVENT_CODES,
} from '../../entities/EntityConstants';
import { OrdersAndOpinionTypes } from '../../../../../web-client/src/presenter/judgeActivityReportState';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { groupBy, orderBy, sortBy } from 'lodash';

export const getOrdersFiledByJudgeInteractor = async (
  applicationContext,
  {
    endDate,
    judgeName,
    startDate,
  }: { judgeName: string; endDate: string; startDate: string },
): Promise<OrdersAndOpinionTypes[]> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let listOfJudgesForRequest = [judgeName];

  if (judgeName === 'all') {
    const judgeUsers = await applicationContext
      .getUseCases()
      .getUsersInSectionInteractor(applicationContext, {
        section: 'judge',
      });
    listOfJudgesForRequest = sortBy(judgeUsers, 'name');
  }

  const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
  const orderEventCodesToSearch = ORDER_EVENT_CODES.filter(
    eventCode => !excludedOrderEventCodes.includes(eventCode),
  );

  const resultsOfAllOrdersByJudges = await Promise.all(
    listOfJudgesForRequest.map(async judge => {
      const searchEntity = new JudgeActivityReportSearch({
        endDate,
        judgeName: judge,
        startDate,
      });

      if (!searchEntity.isValid()) {
        throw new InvalidRequest();
      }
      return await applicationContext
        .getPersistenceGateway()
        .advancedDocumentSearch({
          applicationContext,
          documentEventCodes: orderEventCodesToSearch,
          endDate: searchEntity.endDate,
          judge,
          overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
          startDate: searchEntity.startDate,
        });
    }),
  );

  const totalOrders = resultsOfAllOrdersByJudges.flatMap(obj =>
    obj.results.filter(item => typeof item === 'object'),
  );

  let result = groupBy(totalOrders, 'eventCode');

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
