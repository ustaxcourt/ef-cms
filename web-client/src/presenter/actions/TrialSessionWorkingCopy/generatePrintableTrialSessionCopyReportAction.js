/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */

export const generatePrintableTrialSessionCopyReportAction = async ({
  applicationContext,
  props,
}) => {
  console.log('In generatePrintableTrialSessionCopyReportAction***');

  const { formattedCases, formattedTrialSessionDetails, nameToDisplay } = props;

  console.log('formattedTrialSessionDetails', formattedTrialSessionDetails);

  const pdfUrl = await applicationContext
    .getUseCases()
    .generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
      formattedCases,
      formattedTrialSession: formattedTrialSessionDetails,
      nameToDisplay,
      trialSessionId: formattedTrialSessionDetails.trialSessionId,
    });

  console.log('pdfUrl', pdfUrl);
  return { pdfUrl };
};
