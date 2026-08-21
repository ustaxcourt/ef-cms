import { getDbReader } from '@web-api/persistence/postgres/database';
import { TrialSessionNotificationProcessingKysely } from '@web-api/persistence/postgres/trialSessions/schema';

export const getTrialSessionNotificationProcessing = async ({
  trialSessionId,
}: {
  trialSessionId: string;
}): Promise<TrialSessionNotificationProcessingKysely | undefined> => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwTrialSessionNotificationProcessing')
      .selectAll()
      .where('trialSessionId', '=', trialSessionId)
      .executeTakeFirst(),
  );
};
