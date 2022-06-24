import { omit } from 'lodash';
import { preparedDateToISOString } from '../../../utilities/preparedDateToISOString';
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
  const startDate = preparedDateToISOString(
    applicationContext,
    props.computedStartDate,
  );

  const estimatedEndDate = preparedDateToISOString(
    applicationContext,
    props.computedEstimatedEndDate,
  );

  const trialSession = omit(
    {
      ...get(state.form),
    },
    [
      'startDateYear',
      'startDateMonth',
      'startDateDay',
      'estimatedEndDateYear',
      'estimatedEndDateMonth',
      'estimatedEndDateDay',
    ],
  );

  let result;
  try {
    result = await applicationContext
      .getUseCases()
      .createTrialSessionInteractor(applicationContext, {
        trialSession: { ...trialSession, estimatedEndDate, startDate },
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
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Trial session could not be added.',
      },
    });
  }

  return path.success({
    trialSession: result.trialSessionId,
  });
};
