import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import {
  JudgeActivityReportRequestType,
  OrdersAndOpinionTypes,
} from '../../../../../web-client/src/presenter/judgeActivityReportState';
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

export const getOrdersFiledByJudgeInteractor = async (
  applicationContext,
  { endDate, judgesSelection, startDate }: JudgeActivityReportRequestType,
): Promise<OrdersAndOpinionTypes[]> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judgesSelection,
    startDate,
  });

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
  const orderEventCodesToSearch = ORDER_EVENT_CODES.filter(
    eventCode => !excludedOrderEventCodes.includes(eventCode),
  );

  const resultsOfAllOrdersByJudges = await Promise.all(
    judgesSelection.map(
      async judge =>
        await applicationContext
          .getPersistenceGateway()
          .advancedDocumentSearch({
            applicationContext,
            documentEventCodes: orderEventCodesToSearch,
            endDate: searchEntity.endDate,
            judge,
            overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
            startDate: searchEntity.startDate,
          }),
    ),
  );

  const totalOrders = resultsOfAllOrdersByJudges.flatMap(obj =>
    (obj.results || []).filter(item => typeof item === 'object'),
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
