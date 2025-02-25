import { TDynamoRecord } from '../dynamoTypes';
import { TrialSessionWorkingCopyNotes } from '@shared/business/entities/trialSessions/SpecialTrialSessions';
import { batchGet } from '../../dynamodbClientService';

export const getBulkTrialSessionWorkingCopies = async ({
  applicationContext,
  specialTrialSessions,
}: {
  applicationContext: IApplicationContext;
  specialTrialSessions: Array<{ pk: string; sk: string }>;
}): Promise<Array<TrialSessionWorkingCopyNotes>> => {
  const records: TDynamoRecord[] = await batchGet({
    applicationContext,
    keys: specialTrialSessions,
  });
  return records.map(record => ({
    sessionNotes: record.sessionNotes,
    trialSessionId: record.trialSessionId,
  }));
};
