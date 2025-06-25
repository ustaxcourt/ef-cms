import { fromCaseDeadlineKysely } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbReader } from '@web-api/database';

export const getCaseDeadlinesByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}) => {
  const caseDeadlines = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseDeadline as cd')
      .leftJoin('dwCase as c', 'c.docketNumber', 'cd.docketNumber')
      .where('cd.docketNumber', '=', docketNumber)
      .selectAll('cd')
      .select([
        'c.associatedJudge',
        'c.associatedJudgeId',
        'c.leadDocketNumber',
        // TODO: use c.sortableDocketNumber and remove from caseDeadline
      ])
      .execute(),
  );

  return caseDeadlines.map(caseDeadline =>
    fromCaseDeadlineKysely(caseDeadline),
  );
};
