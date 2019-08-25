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
  const { caseHtml, trialSession, trialSessionId } = props;

  const zipBlob = await applicationContext
    .getUseCases()
    .batchDownloadTrialSessionInteractor({
      applicationContext,
      caseHtml,
      trialSessionId,
    });

  const trialDate = applicationContext
    .getUtilities()
    .formatDateString(trialSession.startDate, 'MMMM_D_YYYY');

  const trialLocation = trialSession.trialLocation
    .replace(/\s/g, '_')
    .replace(/,/g, '');

  const zipName = `${trialDate}_${trialLocation}.zip`;

  const zipFile = new File([zipBlob], zipName, {
    type: 'application/pdf',
  });

  return { zipFile };
};
