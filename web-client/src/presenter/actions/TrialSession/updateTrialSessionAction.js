import { omit } from 'lodash';
import { preparedDateToISOString } from '../../../utilities/preparedDateToISOString';
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
  console.log('startDate before: ', props.computedStartDate);
  const startDate = preparedDateToISOString(
    applicationContext,
    props.computedStartDate,
  );
  console.log('startDate after: ', startDate);

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

  try {
    await applicationContext
      .getUseCases()
      .updateTrialSessionInteractor(applicationContext, {
        trialSession: { ...trialSession, estimatedEndDate, startDate },
      });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Trial session could not be edited.',
      },
    });
  }

  return path.success();
};
