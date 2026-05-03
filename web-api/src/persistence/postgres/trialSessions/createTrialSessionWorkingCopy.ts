import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import {
  fromKyselyNewTrialSessionWorkingCopy,
  toKyselyNewTrialSessionWorkingCopy,
} from '@web-api/persistence/postgres/trialSessions/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const createTrialSessionWorkingCopy = async ({
  trialSessionWorkingCopy,
}: {
  trialSessionWorkingCopy: RawTrialSessionWorkingCopy;
}): Promise<RawTrialSessionWorkingCopy> => {
  const result = (
    await pgInsertInto({
      table: 'dwTrialSessionWorkingCopy',
      values: [toKyselyNewTrialSessionWorkingCopy(trialSessionWorkingCopy)],
      onConflictColumns: ['trialSessionId', 'userId'],
    })
  ).at(0);

  if (!result)
    throw Error('CreateTrialSessionWorkingCopy failed to create a record!!');

  return fromKyselyNewTrialSessionWorkingCopy(result);
};
