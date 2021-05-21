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
  const startDate = // AAAA-BB-CC
    (props.computedDate &&
      applicationContext
        .getUtilities()
        .prepareDateFromString(props.computedDate)
        .toISOString()) ||
    null;

  const trialSession = omit(
    {
      ...get(state.form),
    },
    ['year', 'month', 'day'],
  );

  let result;
  try {
    result = await applicationContext
      .getUseCases()
      .createTrialSessionInteractor(applicationContext, {
        trialSession: { ...trialSession, startDate },
      });

    if (trialSession.swingSession && trialSession.swingSessionId) {
      await applicationContext
        .getUseCases()
        .setTrialSessionAsSwingSessionInteractor(applicationContext, {
          swingSessionId: result.trialSessionId,
          trialSessionId: trialSession.swingSessionId,
        });
    }
  } catch (err) {
    return path.error();
  }

  return path.success({
    trialSession: result.trialSessionId,
  });
};
