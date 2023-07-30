import {
  COURT_ISSUED_EVENT_CODES,
  MAX_ELASTICSEARCH_PAGINATION,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '../../entities/EntityConstants';
import {
  InvalidRequest,
  UnauthorizedError,
} from '../../../../../web-api/src/errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { orderBy } from 'lodash';

/**
 * getOpinionsFiledByJudgeInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the date to end the search for judge activity
 * @param {string} providers.judgeName the name of the judge
 * @param {string} providers.startDate the date to start the search for judge activity
 * @returns {array} list of opinions filed by the judge in the given date range, sorted alphabetically ascending by event code
 */
export const getOpinionsFiledByJudgeInteractor = async (
  applicationContext,
  {
    endDate,
    judgeName,
    startDate,
  }: { judgeName: string; endDate: string; startDate: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judgeName,
    startDate,
  });

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const { results } = await applicationContext
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

  const result = OPINION_EVENT_CODES_WITH_BENCH_OPINION.map(eventCode => {
    const count = results.filter(res => res.eventCode === eventCode).length;
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
