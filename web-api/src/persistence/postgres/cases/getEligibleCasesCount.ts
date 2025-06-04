import { ProcedureType } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';
import { eligibleCasesQuery } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity';

export const getEligibleCasesCount = async ({
  trialCity,
  procedureType,
}: {
  trialCity: string;
  procedureType: ProcedureType;
}): Promise<number> => {
  const caseCount = await getDbReader(reader => {
    return eligibleCasesQuery({ db: reader, trialCity })
      .where('procedureType', '=', procedureType)
      .select(reader.fn.countAll().as('count'))
      .executeTakeFirst();
  });

  return Number(caseCount?.count) || 0;
};
