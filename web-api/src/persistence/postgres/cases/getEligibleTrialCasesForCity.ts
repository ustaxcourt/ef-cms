import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { convertDbRowToRawCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export type EligibleCase = {
  caseTitle: string;
  docketNumber: string;
  caseType: string;
  privatePractitoners?: PrivatePractitioner[];
  irsPractitoners?: IrsPractitioner[];
};

export const getEligibleForTrialCasesByCity = async ({
  trialCity,
}: {
  trialCity: string;
}): Promise<EligibleCase[] | undefined> => {
  const dbCases = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('preferredTrialCity', '=', trialCity)
      .where('status', '=', CASE_STATUS_TYPES.generalDocketReadyForTrial)
      .where('blocked', '!=', true)
      .where('automaticBlocked', '!=', true)
      .selectAll()
      .orderBy('docketNumber', 'asc')
      .execute(),
  );

  const casesForReturn = dbCases.map(c => {
    return c ? transformNullToUndefined(convertDbRowToRawCase(c)) : undefined;
  });

  return casesForReturn;
};
