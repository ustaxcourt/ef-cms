import {
  SpecialTrialSession,
  TrialSessionWorkingCopyNotes,
} from '@shared/business/entities/trialSessions/SpecialTrialSessions';
import { post } from '@shared/proxies/requests';

export const getBulkSpecialTrialSessionCopyNotesInteractor = (
  applicationContext,
  {
    specialTrialSessions,
  }: {
    specialTrialSessions: Array<SpecialTrialSession>;
  },
): Promise<Array<TrialSessionWorkingCopyNotes>> =>
  post({
    applicationContext,
    body: { specialTrialSessions },
    endpoint: '/trial-sessions/bulk-copy-notes',
  });
