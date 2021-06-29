import { state } from 'cerebral';

/**
 * update the qc complete for trial value on a case
 *
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
}) => {
  const { docketNumber, qcCompleteForTrial } = props;
  const trialSessionId = get(state.trialSession.trialSessionId);

  let result;
  try {
    result = await applicationContext
      .getUseCases()
      .updateQcCompleteForTrialInteractor(applicationContext, {
        docketNumber,
        qcCompleteForTrial,
        trialSessionId,
      });
  } catch (err) {
    return path.error();
  }

  return path.success({ updatedCase: result });
};
