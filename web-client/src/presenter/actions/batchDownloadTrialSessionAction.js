/**
 * submits the edit irsPractitioners modal, removing the selected irsPractitioners from the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the batchDownloadTrialSessionInteractor method we will need from the getUseCases method
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {Promise<*>} the success or error path
 */
export const batchDownloadTrialSessionAction = async ({
  applicationContext,
  path,
  props,
}) => {
  try {
    await applicationContext
      .getUseCases()
      .batchDownloadTrialSessionInteractor(applicationContext, {
        trialSessionId: props.trialSessionId,
      });
    return path.success();
  } catch (e) {
    return path.error({ showModal: 'FileCompressionErrorModal' });
  }
};
