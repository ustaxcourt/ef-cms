import { state } from 'cerebral';

/**
 * gets blocked cases by the trial location set on the form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the cases returned from the use case
 */
export const getBlockedCasesByTrialLocationAction = async ({
  applicationContext,
  get,
}) => {
  const trialLocation = get(state.form.trialLocation);

  let blockedCases = [];
  if (trialLocation) {
    blockedCases = await applicationContext
      .getUseCases()
      .getBlockedCasesInteractor(applicationContext, {
        trialLocation,
      });
  }

  return { blockedCases };
};
