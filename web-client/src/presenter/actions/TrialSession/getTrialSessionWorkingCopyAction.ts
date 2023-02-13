/**
 * Fetches the trial session working copy using the getTrialSessionWorkingCopy use case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getTrialSessionWorkingCopy use case
 * @param {Function} providers.get the cerebral get helper function
 * @returns {object} contains the trial session working copy returned from the use case
 */
export const getTrialSessionWorkingCopyAction = async ({
  applicationContext,
  props,
}) => {
  const { trialSessionId } = props;

  const trialSessionWorkingCopy = await applicationContext
    .getUseCases()
    .getTrialSessionWorkingCopyInteractor(applicationContext, {
      trialSessionId,
    });

  return { trialSessionWorkingCopy };
};
