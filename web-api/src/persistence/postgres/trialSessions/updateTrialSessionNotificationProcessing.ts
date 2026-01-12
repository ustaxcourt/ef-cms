import {
  trialSessionNotificationProcessingCaseStatusType,
  trialSessionNotificationProcessingStatusType,
} from '@web-api/persistence/postgres/trialSessions/schema';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updateTrialSessionNotificationProcessing = async ({
  trialSessionId,
  status,
  decrementUnfinishedCases,
  caseStatus,
}: {
  trialSessionId: string;
  status?: trialSessionNotificationProcessingStatusType;
  decrementUnfinishedCases?: boolean;
  caseStatus?: {
    [index: string]: trialSessionNotificationProcessingCaseStatusType;
  };
}): Promise<void>  => {
  await pgUpdateTable({
    table: 'dwTrialSessionNotificationProcessing',
    values: eb => ({
      caseStatuses: caseStatus
        ? eb('caseStatuses', '||', caseStatus)
        : undefined,
      status,
      unfinishedCases: decrementUnfinishedCases
        ? eb('unfinishedCases', '-', 1)
        : undefined,
    }),
    where: cb => cb.where('trialSessionId', '=', trialSessionId),
  });
};
