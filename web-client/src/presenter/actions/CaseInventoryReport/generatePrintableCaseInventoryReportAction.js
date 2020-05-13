import { state } from 'cerebral';

/**
 * generate the printable case inventory report
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 */
export const generatePrintableCaseInventoryReportAction = async ({
  applicationContext,
  get,
}) => {
  const { associatedJudge, status } = get(state.screenMetadata);
  const {
    url,
  } = await applicationContext
    .getUseCases()
    .generatePrintableCaseInventoryReportInteractor({
      applicationContext,
      associatedJudge,
      status,
    });

  return { pdfUrl: url };
};
