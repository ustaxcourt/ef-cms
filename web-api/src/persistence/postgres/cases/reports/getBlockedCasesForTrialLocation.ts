import { rawCaseEntity } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';

const MAX_RESULTS = 5000;

export const getBlockedCasesForTrialLocation = async (
  trialLocation: string,
) => {
  const results = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('preferredTrialCity', '=', trialLocation)
      .where(eb =>
        eb.or([eb('automaticBlocked', '=', true), eb('blocked', '=', true)]),
      )
      .select([
        'automaticBlocked',
        'automaticBlockedDate',
        'automaticBlockedReason',
        'blocked',
        'blockedDate',
        'blockedReason',
        'caption',
        'docketNumber',
        'docketNumberSuffix',
        'leadDocketNumber',
        'status',
        'procedureType',
      ])
      .limit(MAX_RESULTS)
      .execute(),
  );
  return results.map(result => rawCaseEntity(result));
};
