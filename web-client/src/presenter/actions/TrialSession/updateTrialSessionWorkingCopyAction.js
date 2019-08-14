import { state } from 'cerebral';

/**
 * Updates the trial session working copy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the trial sessions returned from the use case
 */
export const updateTrialSessionWorkingCopyAction = async ({
  applicationContext,
  get,
}) => {
  const trialSessionWorkingCopyToUpdate = get(state.trialSessionWorkingCopy);

  return await applicationContext
    .getUseCases()
    .updateTrialSessionWorkingCopyInteractor({
      applicationContext,
      trialSessionWorkingCopyToUpdate,
    });
};
