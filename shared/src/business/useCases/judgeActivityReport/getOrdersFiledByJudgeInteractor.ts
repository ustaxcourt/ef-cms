import {
  COURT_ISSUED_EVENT_CODES,
  ORDER_EVENT_CODES,
} from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import {
  JudgeActivityReportFilters,
  OrdersReturnType,
} from '../../../../../web-client/src/presenter/judgeActivityReportState';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

export const getOrdersFiledByJudgeInteractor = async (
  applicationContext,
  params: JudgeActivityReportFilters,
): Promise<OrdersReturnType> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
  const orderEventCodesToSearch = ORDER_EVENT_CODES.filter(
    eventCode => !excludedOrderEventCodes.includes(eventCode),
  );

  const { aggregations, total } = await applicationContext
    .getPersistenceGateway()
    .fetchEventCodesAggregationForJudges({
      applicationContext,
      params: {
        documentEventCodes: orderEventCodesToSearch,
        endDate: searchEntity.endDate,
        judges: searchEntity.judges,
        searchType: 'order',
        startDate: searchEntity.startDate,
      },
    });

  const computedAggregatedOrdersEventCodes =
    aggregations!.search_field_count.buckets.map(bucketObj => ({
      count: bucketObj.doc_count,
      documentType: COURT_ISSUED_EVENT_CODES.find(
        event => event.eventCode === bucketObj.key,
      )!.documentType,
      eventCode: bucketObj.key,
    }));

  return {
    ordersFiledTotal: total,
    results: computedAggregatedOrdersEventCodes,
  };
};
