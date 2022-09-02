/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */

export const generatePrintableTrialSessionCopyReportAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  // 1. GET THE FORMATTED TRIAL SESSION INFORMATION
  console.log('props', props);

  const { trialSession } = props;
  console.log('trialSession 2', trialSession);

  const pdfUrl = applicationContext
    .getUseCases()
    .generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
      formattedTrialSession: trialSession,
    });

  console.log('pdfUrl', pdfUrl);

  return { pdfUrl };
};
