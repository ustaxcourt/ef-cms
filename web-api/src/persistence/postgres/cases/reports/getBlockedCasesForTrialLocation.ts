import { convertDbRowToRawCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';

const MAX_RESULTS = 5000;

export const getBlockedCasesForTrialLocation = async (
  trialLocation: string,
  filterStatusForTrialLocation: boolean = false,
) => {
  const results = await getDbReader(async reader => {
    let query = reader
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
        'docketNumberWithSuffix',
        'leadDocketNumber',
        'status',
        'procedureType',
      ])
      .limit(MAX_RESULTS);

    if (filterStatusForTrialLocation) {
      query = query.where('status', 'in', [
        CASE_STATUS_TYPES.generalDocket,
        CASE_STATUS_TYPES.generalDocketReadyForTrial,
        CASE_STATUS_TYPES.assignedCase,
        CASE_STATUS_TYPES.assignedMotion,
      ]);
    }

    return await query.execute();
  });

  return results.map(result => convertDbRowToRawCase(result));
};
