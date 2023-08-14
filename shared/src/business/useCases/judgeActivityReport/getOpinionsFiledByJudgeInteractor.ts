import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import {
  JudgeActivityReportFilters,
  OpinionsReturnType,
} from '../../../../../web-client/src/presenter/judgeActivityReportState';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

export const getOpinionsFiledByJudgeInteractor = async (
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

  return await applicationContext
    .getPersistenceGateway()
    .fetchEventCodesCountForJudges({
      applicationContext,
      params: {
        documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
        endDate: searchEntity.endDate,
        judges: searchEntity.judges,
        searchType: 'opinion',
        startDate: searchEntity.startDate,
      },
    });
};
