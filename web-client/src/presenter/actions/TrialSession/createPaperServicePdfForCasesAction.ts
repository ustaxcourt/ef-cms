/**
 * generates the paper service PDF for the calendared cases on a trial session
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} docketEntryId, hasPaper, pdfUrl
 */

export const createPaperServicePdfForCasesAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { trialNoticePdfsKeys } = props;

  const { docketEntryId, hasPaper, pdfUrl } = await applicationContext
    .getUseCases()
    .generateTrialSessionPaperServicePdfInteractor(applicationContext, {
      trialNoticePdfsKeys,
    });

  return { docketEntryId, hasPaper, pdfUrl };
};
