import { omit } from 'lodash';
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
export const updateTrialSessionAction = async ({
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
      .updateTrialSessionInteractor(applicationContext, {
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
    alertSuccess: {
      message: 'Trial session updated.',
    },
    trialSessionId: result.trialSessionId,
  });
};
