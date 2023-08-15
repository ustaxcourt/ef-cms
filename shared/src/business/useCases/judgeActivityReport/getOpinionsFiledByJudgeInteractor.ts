import {
  COURT_ISSUED_EVENT_CODES,
  MAX_ELASTICSEARCH_PAGINATION,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportFilters } from '@web-client/presenter/judgeActivityReportState';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { orderBy } from 'lodash';

export const getOpinionsFiledByJudgeInteractor = async (
  applicationContext,
  params: JudgeActivityReportFilters,
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  params.endDate = params.endDate || '';
  params.judges = params.judges || [];
  params.startDate = params.startDate || '';

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  let sortedResults: Array<{
    results: {
      eventCode: string;
    };
  }>[] = [];

  if (searchEntity.judges.length) {
    sortedResults = await Promise.all(
      searchEntity.judges.map(async judge => {
        const { results } = await applicationContext
          .getPersistenceGateway()
          .advancedDocumentSearch({
            applicationContext,
            documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
            endDate: searchEntity.endDate,
            isOpinionSearch: true,
            judge,
            overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
            startDate: searchEntity.startDate,
          });

        return results;
      }),
    );
  }

  const result: {
    count: number;
    documentType: string | undefined;
    eventCode: string;
  }[] = OPINION_EVENT_CODES_WITH_BENCH_OPINION.map(eventCode => {
    const count = sortedResults
      .flat()
      .filter(res => res.eventCode === eventCode).length;
    return {
      count,
      documentType: COURT_ISSUED_EVENT_CODES.find(
        doc => doc.eventCode === eventCode,
      )?.documentType,
      eventCode,
    };
  });

  const sortedResult = orderBy(result, 'eventCode', 'asc');

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId: params.clientConnectionId,
    message: {
      action: 'fetch_opinions_complete',
      opinions: sortedResult,
    },
    userId: authorizedUser.userId,
  });
};
