/**
 * Fetches the trial sessions using the getTrialSessions use case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the trial sessions returned from the use case
 */
export const getTrialSessionsAction = async ({ applicationContext }) => {
  const trialSessions = await applicationContext
    .getUseCases()
    .getTrialSessionsInteractor(applicationContext);

  return { trialSessions };
};
