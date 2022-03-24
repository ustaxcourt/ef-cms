import { state } from 'cerebral';

/**
 * Fetches the trial sessions by status
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @param {object} providers.props cerebral props
 * @returns {object} contains the trial sessions returned from the use case
 */
export const getTrialSessionsBySelectedTabAction = async ({
  applicationContext,
  get,
}) => {
  const selectedStatusTab = get(state.currentViewMetadata.trialSessions.tab);

  const trialSessions = await applicationContext
    .getUseCases()
    .getTrialSessionsByStatusInteractor(applicationContext, {
      status: selectedStatusTab || 'open',
    });

  return { trialSessions };
};
