import { SpecialTrialSession } from '@shared/business/entities/trialSessions/SpeciailTrialSessions';
const getSpecialTrialSessions = trialSessions =>
  trialSessions
    .filter(trialSession => trialSession.sessionType === 'Special')
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
  const specialTrialSessionCopyNotes = await applicationContext
    .getUseCases()
    .getBulkSpecialTrialSessionCopyNotesInteractor(applicationContext, {
      specialTrialSessions,
    });
  return { specialTrialSessionCopyNotes };
};
