import { omit } from 'lodash';
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
  props,
}) => {
  const startDate = props.computedDate;

  const trialSession = omit(
    {
      ...get(state.form),
    },
    ['year', 'month', 'day'],
  );

  let createTrialSessionResult;

  console.log('in here doing a thing!123');

  try {
    createTrialSessionResult = await applicationContext
      .getUseCases()
      .createTrialSession({
        applicationContext,
        trialSession: { ...trialSession, startDate },
      });

    console.log('got results', createTrialSessionResult);

    if (trialSession.swingSession && trialSession.swingSessionId) {
      await applicationContext.getUseCases().setTrialSessionAsSwingSession({
        applicationContext,
        swingSessionId: createTrialSessionResult.trialSessionId,
        trialSessionId: trialSession.swingSessionId,
      });
    }
  } catch (err) {
    return path.error();
  }

  return path.success({
    trialSession: createTrialSessionResult,
  });
};
