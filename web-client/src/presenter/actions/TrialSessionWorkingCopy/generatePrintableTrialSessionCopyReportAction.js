/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */

export const generatePrintableTrialSessionCopyReportAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  // 1. GET THE FORMATTED TRIAL SESSION INFORMATION
  console.log('props', props);

  const { formattedTrialSessionDetails } = props;
  console.log('trialSession 3', formattedTrialSessionDetails);

  const pdfUrl = await applicationContext
    .getUseCases()
    .generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
      formattedTrialSession: formattedTrialSessionDetails,
    });

  console.log('pdfUrl', pdfUrl);

  return { pdfUrl };
};
