import { Case } from '@shared/business/entities/cases/Case';
import { getDbReader } from '@web-api/database';

export const getCaseByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<Case | undefined> => {
  const caseResult = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .executeTakeFirst(),
  );

  return caseResult
    ? new Case(
        { ...caseResult, associatedJudge: null },
        { authorizedUser: undefined },
      )
    : undefined;
};
