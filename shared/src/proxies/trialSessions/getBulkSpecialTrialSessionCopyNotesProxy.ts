import { SpecialTrialSession } from '@shared/business/entities/trialSessions/SpeciailTrialSessions';
import { post } from '../requests';

export const getBulkSpecialTrialSessionCopyNotesInteractor = (
  applicationContext,
  {
    specialTrialSessions,
  }: {
    specialTrialSessions: Array<SpecialTrialSession>;
  },
) =>
  post({
    applicationContext,
    body: { specialTrialSessions },
    endpoint: '/trial-sessions/bulk-copy-notes',
  });
