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
  const { caseDetails, trialSessionId } = props;

  const result = await applicationContext
    .getUseCases()
    .batchDownloadTrialSessionInteractor({
      applicationContext,
      caseDetails,
      trialSessionId,
    });

  const zipFile = new File([result], 'something.zip');
  const resultBlobUrl = window.URL.createObjectURL(zipFile);
  window.open(resultBlobUrl);
};
