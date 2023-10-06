import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { addDocumentTypeToEventCodeAggregation } from './addDocumentTypeToEventCodeAggregation';

export type JudgeActivityReportFilters = {
  endDate: string;
  startDate: string;
  judges: string[];
};

export type GetCountOfCaseDocumentsFiledByJudgesRequest = {
  endDate: string;
  startDate: string;
  judges: string[];
  documentEventCodes: string[];
};

export const getCountOfCaseDocumentsFiledByJudgesInteractor = async (
  applicationContext: IApplicationContext,
  params: GetCountOfCaseDocumentsFiledByJudgesRequest,
): Promise<AggregatedEventCodesType> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized to view Judge Activity Report');
  }

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest('The Search Params for judges are invalid');
  }

  const { aggregations, total } = await applicationContext
    .getPersistenceGateway()
    .fetchEventCodesCountForJudges({
      applicationContext,
      params: {
        documentEventCodes: params.documentEventCodes,
        endDate: searchEntity.endDate,
        judges: searchEntity.judges,
        startDate: searchEntity.startDate,
      },
    });

  const computedEventCodes =
    addDocumentTypeToEventCodeAggregation(aggregations);

  return {
    aggregations: computedEventCodes,
    total,
  };
};
