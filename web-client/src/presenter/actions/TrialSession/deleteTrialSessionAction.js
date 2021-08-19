import { state } from 'cerebral';

/**
 * update a trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {Promise<object>} the next path based on if creation was successful or error
 */
export const deleteTrialSessionAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const trialSessionId = get(state.trialSessionId);

  let result;
  try {
    result = await applicationContext
      .getUseCases()
      .deleteTrialSessionInteractor(applicationContext, {
        trialSessionId,
      });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Trial session could not be deleted.',
      },
    });
  }

  return path.success({
    trialSession: result.trialSessionId,
  });
};
