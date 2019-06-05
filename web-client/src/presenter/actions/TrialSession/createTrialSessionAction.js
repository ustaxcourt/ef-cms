import { state } from 'cerebral';

/**
 * create a trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {Promise<object>} the next path based on if creation was successful or error
 */
export const createTrialSessionAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const trialSession = get(state.form);

  let createTrialSessionResult;

  try {
    createTrialSessionResult = await applicationContext
      .getUseCases()
      .createTrialSession({
        applicationContext,
        trialSession,
      });
  } catch (err) {
    return path.error();
  }

  return path.success({
    trialSession: createTrialSessionResult,
  });
};
