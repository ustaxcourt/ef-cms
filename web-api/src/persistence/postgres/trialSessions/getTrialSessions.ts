import { RawTrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { getDbReader } from '@web-api/database';
import { fromKyselyTrialSession } from './mapper';

export const getTrialSessions = async (_applicationContext: {
  applicationContext: IApplicationContext;
}): Promise<RawTrialSession[]> => {
  const dbTrialSessions = await getDbReader(reader =>
    reader
      .selectFrom('dwTrialSession')
      .selectAll()
      .execute()
  );

  return dbTrialSessions.map(ts => fromKyselyTrialSession(ts));
};
