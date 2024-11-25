import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import {
  SpecialTrialSession,
  TrialSessionWorkingCopyNotes,
} from '@shared/business/entities/trialSessions/SpecialTrialSessions';
const getSpecialTrialSessions = trialSessions =>
  trialSessions
    .filter(trialSession => trialSession.sessionType === SESSION_TYPES.special)
    .map(trialSession => ({
      trialSessionId: trialSession.trialSessionId,
      userId: trialSession.judge?.userId,
    }));
export const getBulkSpecialTrialSessionCopyNotesAction = async ({
  applicationContext,
  props,
}: ActionProps<{
  trialSessions: SpecialTrialSession[];
}>) => {
  const specialTrialSessions = getSpecialTrialSessions(props.trialSessions);
  const specialTrialSessionCopyNotes: Array<TrialSessionWorkingCopyNotes> =
    await applicationContext
      .getUseCases()
      .getBulkSpecialTrialSessionCopyNotesInteractor(applicationContext, {
        specialTrialSessions,
      });
  return { specialTrialSessionCopyNotes };
};
