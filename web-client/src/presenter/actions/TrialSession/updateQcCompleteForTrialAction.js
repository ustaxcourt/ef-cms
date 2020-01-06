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
  path,
  props,
}) => {
  const { caseId, qcCompleteForTrial } = props;

  let result;
  try {
    result = await applicationContext
      .getUseCases()
      .updateQcCompleteForTrialInteractor({
        applicationContext,
        caseId,
        qcCompleteForTrial,
      });
  } catch (err) {
    return path.error();
  }

  return path.success({ trialSession: result });
};
