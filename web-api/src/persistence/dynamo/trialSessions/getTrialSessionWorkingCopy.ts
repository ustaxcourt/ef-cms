import { TDynamoRecord } from '../dynamoTypes';
import { TrialSessionWorkingCopyNotes } from '@shared/business/entities/trialSessions/SpeciailTrialSessions';
import { batchGet } from '../../dynamodbClientService';
import { get } from '../../dynamodbClientService';

type TrialSessionWorkingCopy = {
  entityName: string;
  sortOrder: string;
  sk: string;
  filters: {
    definiteTrial: boolean;
    probableTrial: boolean;
    motionToDismiss: boolean;
    settled: boolean;
    dismissed: boolean;
    basisReached: boolean;
    continued: boolean;
    submittedCAV: boolean;
    showAll: boolean;
    probableSettlement: boolean;
    setForTrial: boolean;
    recall: boolean;
    rule122: boolean;
    statusUnassigned: boolean;
  };
  sort: string;
  pk: string;
  sessionNotes: string;
  userId: string;
  caseMetadata: object;
  trialSessionId: string;
};

export const getTrialSessionWorkingCopy = ({
  applicationContext,
  trialSessionId,
  userId,
}: {
  applicationContext: IApplicationContext;
  trialSessionId: string;
  userId: string;
}): TrialSessionWorkingCopy =>
  get({
    Key: {
      pk: `trial-session-working-copy|${trialSessionId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });

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
