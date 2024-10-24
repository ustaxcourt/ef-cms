/**
 * get bulk special trial session copy notes
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<object>} the next path based on if creation was successful or error
 */

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
}: ActionProps) => {
  const specialTrialSessions = getSpecialTrialSessions(props.trialSessions);
  const specialTrialSessionCopyNotes = await applicationContext
    .getUseCases()
    .getBulkSpecialTrialSessionCopyNotesInteractor(applicationContext, {
      specialTrialSessions,
    });
  return { specialTrialSessionCopyNotes };
};
