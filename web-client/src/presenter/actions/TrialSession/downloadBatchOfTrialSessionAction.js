/**
 * downloadBatchOfTrialSessionAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the zipFile
 */
export const downloadBatchOfTrialSessionAction = async ({
  applicationContext,
  props,
}) => {
  const { caseHtml, trialSessionId } = props;

  const result = await applicationContext
    .getUseCases()
    .batchDownloadTrialSessionInteractor({
      applicationContext,
      caseHtml,
      trialSessionId,
    });

  location.href = result.url;
};
