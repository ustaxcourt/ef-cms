import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { getDbReader } from '@web-api/database';
import { fromKyselyTrialSession } from './mapper';

export const getTrialSessionById = async ({ trialSessionId }: { trialSessionId: string }
): Promise<RawTrialSession | undefined> => {
  const dbTrialSession = await getDbReader(reader =>
    reader
      .selectFrom('dwTrialSession')
      .selectAll()
      .where('trialSessionId', '=', trialSessionId)
      .executeTakeFirst(),
  );

  if (!dbTrialSession) {
    return undefined;
  }

  return fromKyselyTrialSession(dbTrialSession)
};
