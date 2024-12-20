import { convertDbRowToRawCase } from '@web-api/persistence/postgres/cases/mapper';
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
        eb.or([
          eb('automaticBlocked', '=', true), // 10502 TODO make sure this is indexed
          eb('blocked', '=', true), // 10502 TODO make sure this is indexed
        ]),
      )
      .selectAll()
      .limit(MAX_RESULTS)
      .execute(),
  );
  return results.map(result => convertDbRowToRawCase(result)); // 10502 TODO: Audit the return type, try to limit to info we need
};
