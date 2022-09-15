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
    caseNotesFlag,
    filters,
    formattedCases,
    formattedTrialSessionDetails,
    nameToDisplay,
    sessionNotes,
  } = props;

  console.log('formattedTrialSessionDetails', formattedTrialSessionDetails);

  //Create DTO with only the information needed for the template
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
      nameToDisplay,
      sessionNotes,
      trialSessionId: formattedTrialSessionDetails.trialSessionId,
    });

  console.log('pdfUrl', pdfUrl);
  return { pdfUrl };
};
