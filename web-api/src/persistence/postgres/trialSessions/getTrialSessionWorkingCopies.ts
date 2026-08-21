import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { fromKyselyNewTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/mapper';

export const getTrialSessionWorkingCopies = async ({
  tsWorkingCopyIds,
}: {
  tsWorkingCopyIds: {
    trialSessionId: string;
    userId: string;
  }[];
}): Promise<RawTrialSessionWorkingCopy[]> => {
  if (tsWorkingCopyIds.length == 0) return [];
  const dbTrialSessions = await getDbReader(reader =>
    reader
      .selectFrom('dwTrialSessionWorkingCopy')
      .selectAll()
      .where(qb =>
        qb.or(
          tsWorkingCopyIds.map(pair =>
            qb.and([
              qb('trialSessionId', '=', pair.trialSessionId),
              qb('userId', '=', pair.userId),
            ]),
          ),
        ),
      )
      .execute(),
  );

  return dbTrialSessions.map(ts => fromKyselyNewTrialSessionWorkingCopy(ts));
};
