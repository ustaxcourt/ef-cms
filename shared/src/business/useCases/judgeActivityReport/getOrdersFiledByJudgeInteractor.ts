import { InvalidRequest, UnauthorizedError } from '@shared/errors/errors';
import {
  JudgeActivityReportFilters,
  OrdersReturnType,
} from '@web-client/presenter/judgeActivityReportState';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import { ORDER_EVENT_CODES } from '../../entities/EntityConstants';
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

  return await applicationContext
    .getPersistenceGateway()
    .fetchEventCodesCountForJudges({
      applicationContext,
      params: {
        documentEventCodes: orderEventCodesToSearch,
        endDate: searchEntity.endDate,
        judges: searchEntity.judges,
        searchType: 'order',
        startDate: searchEntity.startDate,
      },
    });
};
