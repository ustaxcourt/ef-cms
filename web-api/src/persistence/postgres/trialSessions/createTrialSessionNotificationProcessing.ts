import { trialSessionNotificationProcessingStatusType } from '@web-api/persistence/postgres/trialSessions/schema';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const createTrialSessionNotificationProcessing = async ({
  unfinishedCasesCount,
  trialSessionId,
}: {
  unfinishedCasesCount: number,
  trialSessionId: string;
}): Promise<void> => {
  const status: trialSessionNotificationProcessingStatusType = 'processing';

  await pgInsertInto({
    table: 'dwTrialSessionNotificationProcessing',
    values: [{
      status,
      trialSessionId,
      unfinishedCases: unfinishedCasesCount,
      caseStatuses: {}
    }]
  })
}
