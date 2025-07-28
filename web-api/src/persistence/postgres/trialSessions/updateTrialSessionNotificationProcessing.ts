import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updateTrialSessionNotificationProcessing = async ({
  trialSessionId,
  status,
  decrementUnfinishedCases,
  caseStatus,
}: {
  trialSessionId: string;
  status?: 'processing' | 'complete';
  decrementUnfinishedCases?: boolean;
  caseStatus?: any;
}) => {
  await pgUpdateTable({
    table: 'dwTrialSessionNotificationProcessing',
    values: eb => ({
      caseStatuses: caseStatus ? eb('caseStatuses', '||', caseStatus) : undefined,
      status,
      unfinishedCases: decrementUnfinishedCases ? eb('unfinishedCases', '-', 1) : undefined,
    }),
    where: cb => cb.where('trialSessionId', '=', trialSessionId),
  });
};
