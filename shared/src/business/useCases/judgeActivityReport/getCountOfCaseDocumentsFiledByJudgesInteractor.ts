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
  aggregations: CaseDocumentsCountType[];
  total: number | undefined;
};

// TODO: refactor JudgeActivityReportFilters to be only types for request to BE
export type JudgeActivityReportFilters = {
  endDate: string;
  startDate: string;
  judgeName?: string;
  judgeId?: string;
  judges?: string[];
  judgeNameToDisplayForHeader?: string;
  searchType: string;
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

  let computeDocumentEventCodes; // type

  if (params.searchType === 'order') {
    computeDocumentEventCodes = orderEventCodesToSearch;
  }

  if (params.searchType === 'opinion') {
    computeDocumentEventCodes = OPINION_EVENT_CODES_WITH_BENCH_OPINION;
  }

  const { aggregations, total } = await applicationContext
    .getPersistenceGateway()
    .fetchEventCodesCountForJudges({
      applicationContext,
      params: {
        documentEventCodes: computeDocumentEventCodes,
        endDate: searchEntity.endDate,
        judges: searchEntity.judges,
        startDate: searchEntity.startDate,
      },
    });

  const computedAggregatedEventCodes =
    addDocumentTypeToEventCodeAggregation(aggregations);

  return { aggregations: computedAggregatedEventCodes, total };
};
