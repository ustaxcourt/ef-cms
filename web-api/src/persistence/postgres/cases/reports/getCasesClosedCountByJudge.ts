import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { CasesClosedReturnType } from '@web-api/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { roundDateDownToNearestHour } from '@shared/business/utilities/DateHandler';

type ClosedCaseResult = {
  status: string;
  count: string;
};

export const getCasesClosedCountByJudge = async ({
  endDate,
  judges,
  startDate,
}: {
  endDate: string;
  judges: string[];
  startDate: string;
}): Promise<CasesClosedReturnType> => {
  const casesAggregatedByStatus: ClosedCaseResult[] = await getDbReader(
    async reader => {
      let query = reader.selectFrom('dwCase');
      if (judges) {
        query = query.where('associatedJudge', 'in', judges);
      }
      query = query
        .where('closedDate', '>=', roundDateDownToNearestHour(startDate))
        .where('closedDate', '<=', roundDateDownToNearestHour(endDate))
        .select(({ fn }) => ['status', fn.count('status').as('count')])
        .groupBy('status');
      return (await query.execute()) as ClosedCaseResult[];
    },
  );

  const total = casesAggregatedByStatus.reduce(
    (accumulator, element) => accumulator + parseInt(element.count),
    0,
  );

  const closedTotal = parseInt(
    casesAggregatedByStatus.find(
      element => element.status === CASE_STATUS_TYPES.closed,
    )?.count ?? '0',
  );

  const closedAndDismissedTotal = parseInt(
    casesAggregatedByStatus.find(
      element => element.status === CASE_STATUS_TYPES.closedDismissed,
    )?.count ?? '0',
  );

  const results = {
    [CASE_STATUS_TYPES.closed]: closedTotal,
    [CASE_STATUS_TYPES.closedDismissed]: closedAndDismissedTotal,
  };

  return { aggregations: results, total };
};
