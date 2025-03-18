import { Case } from '@shared/business/entities/cases/Case';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { transformDBCaseToEntity } from '@web-api/persistence/postgres/cases/mapper';

export type DocketNumberByStatusRequest = {
  statuses: string[];
  judges?: string[];
  excludeMemberCases?: boolean;
};

export type SubmittedCAVTableFields = Pick<
  RawCase,
  | 'caseCaption'
  | 'docketNumber'
  | 'docketNumberWithSuffix'
  | 'associatedJudge'
  | 'leadDocketNumber'
  | 'status'
> & { statusDate: string };

export const getDocketNumbersByStatusAndByJudge = async ({
  params,
}: {
  params: DocketNumberByStatusRequest;
}): Promise<SubmittedCAVTableFields[]> => {
  const rawResults = await getDbReader(reader => {
    let query = reader
      .selectFrom('dwCase as c')
      .leftJoin('dwCaseStatusUpdate as cs', 'c.docketNumber', 'cs.docketNumber')
      .where('c.status', 'in', params.statuses);

    if (!isEmpty(params.judges)) {
      query = query.where('c.associatedJudge', 'in', params.judges);
    }

    return query
      .select(({ fn }) => [
        'c.associatedJudge',
        'c.status',
        'c.caption',
        'c.docketNumber',
        'c.leadDocketNumber',
        'c.docketNumberSuffix',
        fn.max('cs.date').as('statusDate'),
      ])
      .groupBy([
        'c.associatedJudge',
        'c.status',
        'c.caption',
        'c.docketNumber',
        'c.docketNumberSuffix',
      ])
      .limit(MAX_ELASTICSEARCH_PAGINATION)
      .execute();
  });

  let results = rawResults.map(result =>
    transformDBCaseToEntity({
      ...result,
      caseCaption: result.caption,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: result.docketNumber,
        docketNumberSuffix: result.docketNumberSuffix,
      }),
      statusDate: result.statusDate ? result.statusDate.toISOString() : '',
    }),
  );

  if (params.excludeMemberCases) {
    results = results.filter(
      caseInfo =>
        !caseInfo.leadDocketNumber ||
        caseInfo.docketNumber === caseInfo.leadDocketNumber,
    );
  }

  results = Case.sortByDocketNumber(results);

  return results;
};
