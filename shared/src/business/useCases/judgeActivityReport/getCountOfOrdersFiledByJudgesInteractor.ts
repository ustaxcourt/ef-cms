import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import { ORDER_EVENT_CODES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { addDocumentTypeToEventCodeAggregation } from './addDocumentTypeToEventCodeAggregation';

export type OrdersAndOpinionResultCountTypes = {
  count: number;
  documentType: string | undefined;
  eventCode: string;
};

export type OrdersReturnType = {
  aggregations: OrdersAndOpinionResultCountTypes[];
  total: number | undefined;
};

export const getCountOfOrdersFiledByJudgesInteractor = async (
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
    .fetchEventCodesCountForJudges({
      applicationContext,
      params: {
        documentEventCodes: orderEventCodesToSearch,
        endDate: searchEntity.endDate,
        judges: searchEntity.judges,
        startDate: searchEntity.startDate,
      },
    });

  const computedAggregatedEventCodes =
    addDocumentTypeToEventCodeAggregation(aggregations);

  return { aggregations: computedAggregatedEventCodes, total };
};
