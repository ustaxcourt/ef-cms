import { Case } from '@shared/business/entities/cases/Case';
import { MAX_ELASTICSEARCH_PAGINATION } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';

export type DocketNumberByStatusRequest = {
  statuses: string[];
  judges?: string[];
  excludeMemberCases?: boolean;
};

export type SubmittedCAVTableFields = Pick<
  RawCase,
  | 'caseCaption'
  | 'caseStatusHistory'
  | 'docketNumber'
  | 'docketNumberWithSuffix'
  | 'associatedJudge'
  | 'leadDocketNumber'
  | 'status'
  | 'petitioners'
>;

export const getDocketNumbersByStatusAndByJudge = async ({
  params,
}: {
  params: DocketNumberByStatusRequest;
}): Promise<SubmittedCAVTableFields[]> => {
  const rawResults = await getDbReader(reader => {
    let query = reader
      .selectFrom('dwCase')
      .where('status', 'in', params.statuses);
    if (!isEmpty(params.judges)) {
      query = query.where('associatedJudge', 'in', params.judges);
    }
    // if (params.excludeMemberCases) {
    //   query = query.where('leadDocketNumber', 'is not', null); // fake: need lead docket number is not docket number, or just do this in code after the query
    // }
    return query
      .select([
        'associatedJudge',
        'status',
        'caption',
        'docketNumber',
        'leadDocketNumber',
        'docketNumberSuffix',
      ]) // select other fields, and get case status history and petitioners ... but check these are actually needed in the response first
      .limit(MAX_ELASTICSEARCH_PAGINATION)
      .execute();
  });

  let results = rawResults.map(result => ({
    ...result,
    caseCaption: result.caption,
    docketNumberWithSuffix: result.docketNumber + result.docketNumberSuffix,
  }));

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
