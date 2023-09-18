import { omit } from 'lodash';
import { preparedDateToISOString } from '../../../utilities/preparedDateToISOString';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * update a trial session
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
}: ActionProps) => {
  const estimatedEndDate = preparedDateToISOString(
    applicationContext,
    props.computedEstimatedEndDate,
  );

  const trialSession = omit(
    {
      ...get(state.form),
    },
    ['estimatedEndDateYear', 'estimatedEndDateMonth', 'estimatedEndDateDay'],
  );

  try {
    await applicationContext
      .getUseCases()
      .updateTrialSessionInteractor(applicationContext, {
        trialSession: { ...trialSession, estimatedEndDate },
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
