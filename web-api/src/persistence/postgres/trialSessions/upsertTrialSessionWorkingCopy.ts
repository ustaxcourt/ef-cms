import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { toKyselyNewTrialSessionWorkingCopy } from '@web-api/persistence/postgres/trialSessions/mapper';

export const upsertTrialSessionWorkingCopy = async ({
  trialSessionWorkingCopyToUpdate,
}: {
  trialSessionWorkingCopyToUpdate: RawTrialSessionWorkingCopy;
}): Promise<void> =>{
  await pgInsertInto({
    table: 'dwTrialSessionWorkingCopy',
    values: [
      toKyselyNewTrialSessionWorkingCopy(trialSessionWorkingCopyToUpdate),
    ],
    onConflictColumns: ['trialSessionId', 'userId'],
  });};
