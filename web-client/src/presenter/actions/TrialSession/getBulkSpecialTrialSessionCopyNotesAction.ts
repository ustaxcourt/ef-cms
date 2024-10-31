const getSpecialTrialSessions = trialSessions =>
  trialSessions
    .filter(trialSession => trialSession.sessionType === 'Special')
    .map(trialSession => ({
      trialSessionId: trialSession.trialSessionId,
      userId: trialSession.judge?.userId,
    }));
interface SpecialTrialSession {
  userId: string;
  trialSessionId: string;
}
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
