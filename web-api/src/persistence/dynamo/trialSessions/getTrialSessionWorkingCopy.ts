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
