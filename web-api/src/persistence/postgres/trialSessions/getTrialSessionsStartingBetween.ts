import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { fromKyselyTrialSession } from './mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';

/**
 * Gets the trial sessions that start in a date range, without their case orders
 * or paper service PDFs. Use it when the caller needs only the session details,
 * because reading every case on every session is the slow part of getTrialSessions.
 */
export const getTrialSessionsStartingBetween = async ({
  begin,
  end,
}: {
  begin: string;
  end: string;
}): Promise<RawTrialSession[]> => {
  const dbTrialSessions = await getDbReader(reader =>
    reader
      .selectFrom('dwTrialSession')
      .selectAll()
      .where('startDate', '>=', calculateDate({ dateString: begin }))
      .where('startDate', '<=', calculateDate({ dateString: end }))
      .orderBy('startDate')
      .execute(),
  );

  return dbTrialSessions.map(trialSession =>
    fromKyselyTrialSession(trialSession, [], []),
  );
};
