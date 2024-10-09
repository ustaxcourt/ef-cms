import { AggregatedEventCodesType } from '@web-api/persistence/elasticsearch/fetchEventCodesCountForJudges';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addDocumentTypeToEventCodeAggregation } from './addDocumentTypeToEventCodeAggregation';

export type JudgeActivityReportFilters = {
  endDate: string;
  startDate: string;
  judgeName: string;
};

export type JudgeActivityStatisticsRequest = {
  endDate: string;
  startDate: string;
  judgeIds: string[];
};

export type GetCountOfCaseDocumentsFiledByJudgesRequest = {
  endDate: string;
  startDate: string;
  judgeIds: string[];
  documentEventCodes: string[];
};

export const getCountOfCaseDocumentsFiledByJudgesInteractor = async (
  applicationContext: ServerApplicationContext,
  params: GetCountOfCaseDocumentsFiledByJudgesRequest,
  authorizedUser: UnknownAuthUser,
): Promise<AggregatedEventCodesType> => {
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
        judgeIds: searchEntity.judgeIds,
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
