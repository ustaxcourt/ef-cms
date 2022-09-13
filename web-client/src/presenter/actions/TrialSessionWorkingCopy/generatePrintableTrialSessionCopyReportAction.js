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
  console.log('caseNotesFlag***', props.caseNotesFlag);

  const {
    filters,
    formattedCases,
    formattedTrialSessionDetails,
    nameToDisplay,
    sessionNotes,
  } = props;

  console.log('formattedTrialSessionDetails', formattedTrialSessionDetails);

  const pdfUrl = await applicationContext
    .getUseCases()
    .generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
      filters,
      formattedCases,
      formattedTrialSession: formattedTrialSessionDetails,
      nameToDisplay,
      sessionNotes,
      trialSessionId: formattedTrialSessionDetails.trialSessionId,
    });

  console.log('pdfUrl', pdfUrl);
  return { pdfUrl };
};
