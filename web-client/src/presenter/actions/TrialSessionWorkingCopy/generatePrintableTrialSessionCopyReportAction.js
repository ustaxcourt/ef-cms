/**
 * generatePrintableTrialSessionCopyReportAction
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {String} pdfUrl
 */

export const generatePrintableTrialSessionCopyReportAction = async ({
  applicationContext,
  props,
}) => {
  const {
    caseNotesFlag,
    filters,
    formattedCases,
    formattedTrialSessionDetails,
    sessionNotes,
  } = props;

  console.log('formattedTrialSessionDetails', formattedTrialSessionDetails);

  const formattedCasesDTO = formattedCases.map(formattedCase => {
    return {
      calendarNotes: formattedCase.calendarNotes,
      caseTitle: formattedCase.caseTitle,
      docketNumber: formattedCase.docketNumber,
      docketNumberWithSuffix: formattedCase.docketNumberWithSuffix,
      filingPartiesCode: formattedCase.filingPartiesCode,
      inConsolidatedGroup: formattedCase.inConsolidatedGroup,
      irsPractitioners: formattedCase.irsPractitioners,
      leadCase: formattedCase.leadCase,
      privatePractitioners: formattedCase.privatePractitioners,
      trialStatus: formattedCase.trialStatus,
      userNotes: formattedCase.userNotes,
    };
  });

  const formattedEstimatedEndDateFull = applicationContext
    .getUtilities()
    .formatDateString(
      formattedTrialSessionDetails.estimatedEndDate,
      'MONTH_DAY_YEAR',
    );

  const formattedTrialSessionDTO = {
    computedStatus: formattedTrialSessionDetails.computedStatus,
    formattedEstimatedEndDateFull,
    formattedJudge: formattedTrialSessionDetails.formattedJudge,
    formattedStartDateFull: formattedTrialSessionDetails.formattedStartDateFull,
    formattedTerm: formattedTrialSessionDetails.formattedTerm,
    trialLocation: formattedTrialSessionDetails.trialLocation,
  };

  const pdfUrl = await applicationContext
    .getUseCases()
    .generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
      caseNotesFlag,
      filters,
      formattedCases: formattedCasesDTO,
      formattedTrialSession: formattedTrialSessionDTO,
      sessionNotes,
      trialSessionId: formattedTrialSessionDetails.trialSessionId,
    });

  return { pdfUrl };
};
