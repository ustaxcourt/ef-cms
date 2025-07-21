import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { getDbReader } from '@web-api/database';
import { fromKyselyTrialSession } from './mapper';

export const getTrialSessionById = async (
  _applicationContext: {
    applicationContext: IApplicationContext;
  },
  trialSessionId: string,
): Promise<RawTrialSession[]> => {
  const dbTrialSessions = await getDbReader(reader =>
    reader
      .selectFrom('dwTrialSession')
      .selectAll()
      .where('trialSessionId', '=', trialSessionId)
      .execute(),
  );

  return dbTrialSessions.map(ts => fromKyselyTrialSession(ts));
};
