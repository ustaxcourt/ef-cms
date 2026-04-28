import {
  SpecialTrialSession,
  TrialSessionWorkingCopyNotes,
} from '@shared/business/entities/trialSessions/SpecialTrialSessions';
import { post } from '@web-client/proxies/requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getBulkSpecialTrialSessionCopyNotesInteractor = (
  applicationContext: ClientApplicationContext,
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
