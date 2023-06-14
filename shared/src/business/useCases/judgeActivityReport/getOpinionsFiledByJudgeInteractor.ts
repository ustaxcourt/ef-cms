import {
  COURT_ISSUED_EVENT_CODES,
  MAX_ELASTICSEARCH_PAGINATION,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { orderBy } from 'lodash';

export const getOpinionsFiledByJudgeInteractor = async (
  applicationContext,
  {
    endDate,
    judgesSelection,
    startDate,
  }: { judgesSelection: string[]; endDate: string; startDate: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const aggregatedOpinionsResults = await Promise.all(
    judgesSelection.map(async eachJudge => {
      const searchEntity = new JudgeActivityReportSearch({
        endDate,
        judgeName: eachJudge,
        startDate,
      });

      if (!searchEntity.isValid()) {
        throw new InvalidRequest();
      }

      return await applicationContext
        .getPersistenceGateway()
        .advancedDocumentSearch({
          applicationContext,
          documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
          endDate: searchEntity.endDate,
          isOpinionSearch: true,
          judge: searchEntity.judgeName,
          overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
          startDate: searchEntity.startDate,
        });
    }),
  );

  const totalOpinionResults = aggregatedOpinionsResults.flatMap(obj =>
    obj.results.filter(item => typeof item === 'object'),
  );

  const result = OPINION_EVENT_CODES_WITH_BENCH_OPINION.map(eventCode => {
    const count = totalOpinionResults.filter(
      res => res.eventCode === eventCode,
    ).length;
    return {
      count,
      documentType: COURT_ISSUED_EVENT_CODES.find(
        doc => doc.eventCode === eventCode,
      )?.documentType,
      eventCode,
    };
  });

  const sortedResult = orderBy(result, 'eventCode', 'asc');

  return sortedResult;
};
