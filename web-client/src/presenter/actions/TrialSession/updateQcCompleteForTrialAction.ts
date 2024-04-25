import { state } from '@web-client/presenter/app.cerebral';

/**
 * update the qc complete for trial value on a case
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {Promise<object>} the next path based on if creation was successful or error
 */
export const updateQcCompleteForTrialAction = async ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const { docketNumber, qcCompleteForTrial } = props;
  const trialSessionId = get(state.trialSession.trialSessionId);

  try {
    const result = await applicationContext
      .getUseCases()
      .updateQcCompleteForTrialInteractor(applicationContext, {
        docketNumber,
        qcCompleteForTrial,
        trialSessionId,
      });
    return path.success({ updatedCase: result });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Could not complete QC eligible case.',
      },
    });
  }
};
