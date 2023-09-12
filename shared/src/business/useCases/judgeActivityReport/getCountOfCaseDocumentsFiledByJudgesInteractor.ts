import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
} from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { addDocumentTypeToEventCodeAggregation } from './addDocumentTypeToEventCodeAggregation';

export type CaseDocumentsCountType = {
  count: number;
  documentType: string | undefined;
  eventCode: string;
};

export type CaseDocumentsAggregationReturnType = {
  orderAggregations: CaseDocumentsCountType[];
  opinionAggregations: CaseDocumentsCountType[];
  orderTotal: number | undefined;
  opinionTotal: number | undefined;
};

// TODO: refactor JudgeActivityReportFilters to be only types for request to BE
export type JudgeActivityReportFilters = {
  endDate: string;
  startDate: string;
  judgeName?: string;
  judgeId?: string;
  judges?: string[];
  judgeNameToDisplayForHeader?: string;
};

export const getCountOfCaseDocumentsFiledByJudgesInteractor = async (
  applicationContext: IApplicationContext,
  params: JudgeActivityReportFilters,
): Promise<CaseDocumentsAggregationReturnType> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized to view Judge Activity Report');
  }

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest('The Search Params for judges are invalid');
  }

  const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
  const orderEventCodesToSearch = ORDER_EVENT_CODES.filter(
    eventCode => !excludedOrderEventCodes.includes(eventCode),
  );

  const { aggregations: opinionAggregationCount, total: opinionTotal } =
    await applicationContext
      .getPersistenceGateway()
      .fetchEventCodesCountForJudges({
        applicationContext,
        params: {
          documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
          endDate: searchEntity.endDate,
          judges: searchEntity.judges,
          startDate: searchEntity.startDate,
        },
      });

  const computedAggregatedOpinionEventCodes =
    addDocumentTypeToEventCodeAggregation(opinionAggregationCount);

  const { aggregations: orderAggregationCount, total: orderTotal } =
    await applicationContext
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

  const computedAggregatedOrderEventCodes =
    addDocumentTypeToEventCodeAggregation(orderAggregationCount);

  return {
    opinionAggregations: computedAggregatedOpinionEventCodes,
    opinionTotal,
    orderAggregations: computedAggregatedOrderEventCodes,
    orderTotal,
  };
};
