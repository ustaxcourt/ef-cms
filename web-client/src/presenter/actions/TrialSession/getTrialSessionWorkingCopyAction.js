/**
 * Fetches the trial sessions using the getTrialSessions use case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the trial sessions returned from the use case
 */
export const getTrialSessionWorkingCopyAction = async ({
  applicationContext,
  props,
}) => {
  const { trialSessionId } = props;

  const trialSessionWorkingCopy = await applicationContext
    .getUseCases()
    .getTrialSessionWorkingCopyInteractor({
      applicationContext,
      trialSessionId,
    });

  return { trialSessionWorkingCopy };
};
