import { state } from '@web-client/presenter/app.cerebral';

/**
 * Attempts to download all cases in a trial session
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext contains the batchDownloadTrialSessionInteractor method we will need from the getUseCases method
 * @param {object} providers.get the cerebral get function used for getting state
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {Promise<*>} the success or error path
 */
export const batchDownloadTrialSessionAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { trialSessionId } = get(state.trialSession);

  try {
    await applicationContext
      .getUseCases()
      .batchDownloadTrialSessionInteractor(applicationContext, {
        trialSessionId,
      });

    return path.success();
  } catch (e) {
    return path.error({ showModal: 'FileCompressionErrorModal' });
  }
};
