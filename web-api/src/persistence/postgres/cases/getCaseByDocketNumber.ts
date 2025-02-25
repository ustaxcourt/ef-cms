import { getDbReader } from '@web-api/database';

// Named getCaseByDocketNumberPostgres until the Dynamo getCaseByDocketNumber is removed
export const getCaseByDocketNumberPostgres = async (docketNumber: string) => {
  return await getDbReader(reader => {
    return reader
      .selectFrom('dwCase as c')
      .leftJoin('dwWorkItem as d', 'd.docketNumber', 'c.docketNumber')
      .leftJoin(
        'dwCaseCorrespondence as co',
        'c.docketNumber',
        'co.docketNumber',
      )
      .where('c.docketNumber', '=', docketNumber)
      .selectAll()
      .select('c.docketNumber')
      .execute();
  });
};
