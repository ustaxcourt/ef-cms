import { DEADLINE_REPORT_PAGE_SIZE } from '../../../../../shared/src/business/entities/EntityConstants';
import { caseDeadlineEntity } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbReader } from '@web-api/database';

export const getCaseDeadlinesByDateRange = async ({
  endDate,
  from = 0,
  judge,
  pageSize,
  startDate,
}) => {
  const size =
    pageSize && pageSize <= DEADLINE_REPORT_PAGE_SIZE
      ? pageSize
      : DEADLINE_REPORT_PAGE_SIZE;

  const { results: caseDeadlines, total: totalCount } = await getDbReader(
    async reader => {
      let deadlineQuery = reader
        .selectFrom('dwCaseDeadline')
        .selectAll()
        .where('deadlineDate', '>=', startDate)
        .where('deadlineDate', '<=', endDate);

      if (judge) {
        deadlineQuery = deadlineQuery.where('associatedJudge', '=', judge);
      }

      deadlineQuery = deadlineQuery
        .offset(from)
        .limit(size)
        .orderBy('deadlineDate', 'asc')
        .orderBy('sortableDocketNumber', 'asc');

      const results = await deadlineQuery.execute();

      let countQuery = reader
        .selectFrom('dwCaseDeadline')
        .select(reader.fn.count('docketNumber').as('totalCount'))
        .where('deadlineDate', '>=', startDate)
        .where('deadlineDate', '<=', endDate);

      if (judge) {
        countQuery = countQuery.where('associatedJudge', '=', judge);
      }

      const total = await countQuery.executeTakeFirst();

      return {
        results,
        total: total?.totalCount || 0,
      };
    },
  );

  return {
    foundDeadlines: caseDeadlines.map(caseDeadline =>
      caseDeadlineEntity(caseDeadline),
    ),
    totalCount,
  };
};
