import { post } from '../requests';

export const getBulkSpecialTrialSessionCopyNotesInteractor = (
  applicationContext,
  {
    specialTrialSessions,
  }: {
    specialTrialSessions: Array<{ userId: string; trialSessionId: string }>;
  },
) =>
  post({
    applicationContext,
    body: { specialTrialSessions },
    endpoint: '/trial-sessions/bulk-copy-notes',
  });
