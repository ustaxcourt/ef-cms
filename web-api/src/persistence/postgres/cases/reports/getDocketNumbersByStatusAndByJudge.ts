import { Case } from '@shared/business/entities/cases/Case';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';

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
  const rawResults = await getDbReader(async reader => {
    let query = reader
      .selectFrom('dwCase as c')
      .select([
        'c.associatedJudge',
        'c.status',
        'c.caption',
        'c.docketNumber',
        'c.leadDocketNumber',
        'c.docketNumberSuffix',
        'c.caseStatusHistory',
      ])
      .where('c.status', 'in', params.statuses);

    if (params.judges?.length) {
      query = query.where('c.associatedJudge', 'in', params.judges);
    }

    return await query.limit(MAX_ELASTICSEARCH_PAGINATION).execute();
  });

  // for each case, statusDate as the max date of caseStatusHistory
  let results = rawResults.map(result =>
    fromKyselyCase({
      ...result,
      caseCaption: result.caption,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: result.docketNumber,
        docketNumberSuffix: result.docketNumberSuffix,
      }),
      statusDate: result.caseStatusHistory.length
        ? result.caseStatusHistory.at(-1)!.date
        : '',
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
