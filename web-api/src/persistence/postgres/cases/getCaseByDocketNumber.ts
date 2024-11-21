import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { getDbReader } from '@web-api/database';

export const getCaseByDocketNumber = async ({
  authorizedUser,
  docketNumber,
}: {
  docketNumber: string;
  authorizedUser?: AuthUser;
}): Promise<Case | undefined> => {
  const caseResult = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .executeTakeFirst(),
  );

  return caseResult
    ? // TODO 10502: Use CaseFactory
      new Case({ ...caseResult, associatedJudge: null }, { authorizedUser })
    : undefined;
};
