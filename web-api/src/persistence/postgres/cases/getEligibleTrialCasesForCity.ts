import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { convertDbRowToRawCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getEligibleForTrialCasesByCity = async ({
  trialCity,
}: {
  trialCity: string;
}): Promise<RawCase[] | undefined> => {
  const dbCases = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('preferredTrialCity', '=', trialCity)
      .where('status', '=', CASE_STATUS_TYPES.generalDocketReadyForTrial)
      .where('blocked', '!=', true)
      .where('automaticBlocked', '!=', true)
      .selectAll()
      .execute(),
  );

  const casesForReturn = dbCases.map(c => {
    return c ? transformNullToUndefined(convertDbRowToRawCase(c)) : undefined;
  });

  return casesForReturn;
};
