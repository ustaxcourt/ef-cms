import { InvalidRequest, UnauthorizedError } from '@shared/errors/errors';
import {
  JudgeActivityReportFilters,
  OrdersAndOpinionResultCountTypes,
} from './getCountOfOrdersFiledByJudgesInteractor';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { addDocumentTypeToEventCodeAggregation } from './addDocumentTypeToEventCodeAggregation';

export type OpinionsReturnType = {
  aggregations: OrdersAndOpinionResultCountTypes[];
  total: number | undefined;
};

export const getCountOfOpinionsFiledByJudgesInteractor = async (
  applicationContext: IApplicationContext,
  params: JudgeActivityReportFilters,
): Promise<OpinionsReturnType> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const { aggregations, total } = await applicationContext
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

  const computedAggregatedEventCodes =
    addDocumentTypeToEventCodeAggregation(aggregations);

  return { aggregations: computedAggregatedEventCodes, total };
};
