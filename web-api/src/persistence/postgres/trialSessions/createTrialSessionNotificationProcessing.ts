import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const createTrialSessionNotificationProcessing = async ({
  unfinishedCasesCount,
  trialSessionId,
}: {
  unfinishedCasesCount: number,
  trialSessionId: string;
}) => {
  const status: 'processing' | 'complete' = 'processing';

  await pgInsertInto({
    table: 'dwTrialSessionNotificationProcessing',
    values: [{
      status,
      trialSessionId,
      unfinishedCases: unfinishedCasesCount,
      caseStatuses: []
    }]
  })
}
