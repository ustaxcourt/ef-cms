import { CASE_DEADLINES_REPORT_PAGE_SIZE } from '../../../../../shared/src/business/entities/EntityConstants';
import { caseDeadlineEntity } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbReader } from '@web-api/database';

export const getCaseDeadlinesByDateRange = async ({
  endDate,
  from = 0,
  judgeId,
  pageSize,
  startDate,
}: {
  endDate;
  from: number;
  judgeId?: string | null;
  pageSize: number;
  startDate;
}) => {
  const size =
    pageSize && pageSize <= CASE_DEADLINES_REPORT_PAGE_SIZE
      ? pageSize
      : CASE_DEADLINES_REPORT_PAGE_SIZE;

  const { results: caseDeadlines, total: totalCount } = await getDbReader(
    async reader => {
      let deadlineQuery = reader
        .selectFrom('dwCaseDeadline as cd')
        .leftJoin('dwCase as c', 'c.docketNumber', 'cd.docketNumber')
        .selectAll('cd')
        .select([
          'c.associatedJudge',
          'c.associatedJudgeId',
          'c.leadDocketNumber',
          // TODO: use c.sortableDocketNumber and remove from caseDeadline
        ])
        .where('cd.deadlineDate', '>=', startDate)
        .where('cd.deadlineDate', '<=', endDate);

      deadlineQuery = applyJudgeFilter(deadlineQuery, judgeId);

      deadlineQuery = deadlineQuery
        .offset(from)
        .limit(size)
        .orderBy('cd.deadlineDate', 'asc')
        .orderBy('cd.sortableDocketNumber', 'asc');

      const results = await deadlineQuery.execute();

      let countQuery = reader
        .selectFrom('dwCaseDeadline')
        .select(reader.fn.count('docketNumber').as('totalCount'))
        .where('deadlineDate', '>=', startDate)
        .where('deadlineDate', '<=', endDate);

      countQuery = applyJudgeFilter(countQuery, judgeId);

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

const applyJudgeFilter = (query, judgeId) => {
  if (judgeId === null) {
    return query.where('associatedJudgeId', 'is', null);
  } else if (judgeId !== undefined) {
    return query.where('associatedJudgeId', '=', judgeId);
  }

  return query;
};
