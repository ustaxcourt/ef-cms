import { state } from 'cerebral';

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
  get,
  props,
}) => {
  const {
    filters,
    formattedCases,
    formattedTrialSessionDetails,
    sessionNotes,
    showCaseNotes,
  } = props;

  const { caseMetadata } = get(state.trialSessionWorkingCopy);

  const formattedCasesDTO = formattedCases.map(formattedCase => {
    const trialStatus =
      caseMetadata[formattedCase.docketNumber]?.trialStatus ||
      formattedCase.trialStatus;

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
      trialStatus,
      userNotes: formattedCase.userNotes,
    };
  });

  const formattedEstimatedEndDateFull = applicationContext
    .getUtilities()
    .formatDateString(
      formattedTrialSessionDetails.estimatedEndDate,
      'MONTH_DAY_YEAR',
    );

  const endDateForAdditionalPageHeaders = () => {
    return applicationContext
      .getUtilities()
      .formatDateString(
        formattedTrialSessionDetails.estimatedEndDate,
        'SHORT_MONTH_DAY_YEAR',
      );
  };

  const startDateForAdditionalPageHeaders = () => {
    return applicationContext
      .getUtilities()
      .formatDateString(
        formattedTrialSessionDetails.startDate,
        'SHORT_MONTH_DAY_YEAR',
      );
  };

  const formattedTrialSessionDTO = {
    computedStatus: formattedTrialSessionDetails.computedStatus,
    endDateForAdditionalPageHeaders: endDateForAdditionalPageHeaders(),
    formattedEstimatedEndDateFull,
    formattedJudge: formattedTrialSessionDetails.formattedJudge,
    formattedStartDateFull: formattedTrialSessionDetails.formattedStartDateFull,
    formattedTerm: formattedTrialSessionDetails.formattedTerm,
    startDateForAdditionalPageHeaders: startDateForAdditionalPageHeaders(),
    trialLocation: formattedTrialSessionDetails.trialLocation,
  };

  const pdfUrl = await applicationContext
    .getUseCases()
    .generatePrintableTrialSessionCopyReportInteractor(applicationContext, {
      filters,
      formattedCases: formattedCasesDTO,
      formattedTrialSession: formattedTrialSessionDTO,
      sessionNotes,
      showCaseNotes,
      trialSessionId: formattedTrialSessionDetails.trialSessionId,
    });

  return { pdfUrl };
};
