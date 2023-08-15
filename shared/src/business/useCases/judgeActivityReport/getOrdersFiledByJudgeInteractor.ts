import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import {
  JudgeActivityReportFilters,
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
  params: JudgeActivityReportFilters,
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  params.endDate = params.endDate || '';
  params.judges = params.judges || [];
  params.startDate = params.startDate || '';

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
  const orderEventCodesToSearch = ORDER_EVENT_CODES.filter(
    eventCode => !excludedOrderEventCodes.includes(eventCode),
  );

  let sortedResults: {
    results: {
      documentType: string;
    };
  }[][] = [];

  if (searchEntity.judges.length) {
    sortedResults = await Promise.all(
      searchEntity.judges.map(async judge => {
        const { results } = await applicationContext
          .getPersistenceGateway()
          .advancedDocumentSearch({
            applicationContext,
            documentEventCodes: orderEventCodesToSearch,
            endDate: searchEntity.endDate,
            judge,
            overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
            startDate: searchEntity.startDate,
          });

        return results;
      }),
    );
  }

  const result = groupBy(sortedResults.flat(), 'eventCode');

  const formattedResult: Array<OrdersAndOpinionTypes> = Object.entries(
    result,
  ).map(([key, value]) => {
    return {
      count: value.length,
      documentType: value[0].documentType,
      eventCode: key,
    };
  });

  const sortedResult = orderBy(formattedResult, 'eventCode', 'asc');

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId: params.clientConnectionId,
    message: {
      action: 'fetch_orders_complete',
      orders: sortedResult,
    },
    userId: authorizedUser.userId,
  });
};
