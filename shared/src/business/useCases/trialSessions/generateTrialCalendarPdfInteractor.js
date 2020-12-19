const {
  saveFileAndGenerateUrl,
} = require('../../useCaseHelper/saveFileAndGenerateUrl');

/**
 * generateTrialCalendarPdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {string} trial session calendar pdf url
 */
exports.generateTrialCalendarPdfInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const formattedTrialSession = applicationContext
    .getUtilities()
    .formattedTrialSessionDetails({
      applicationContext,
      trialSession,
    });

  const calendaredCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  const getPractitionerName = practitioner => {
    const { barNumber, name } = practitioner;
    const barNumberFormatted = barNumber ? ` (${barNumber})` : '';
    return `${name}${barNumberFormatted}`;
  };

  const formattedOpenCases = calendaredCases
    .filter(calendaredCase => calendaredCase.removedFromTrial !== true)
    .map(openCase => {
      return {
        caseTitle: applicationContext.getCaseTitle(openCase.caseCaption || ''),
        docketNumber: openCase.docketNumber,
        docketNumberWithSuffix: openCase.docketNumberWithSuffix,
        petitionerCounsel: (openCase.privatePractitioners || []).map(
          getPractitionerName,
        ),
        respondentCounsel: (openCase.irsPractitioners || []).map(
          getPractitionerName,
        ),
      };
    });

  formattedTrialSession.caseOrder.forEach(aCase => {
    if (aCase.calendarNotes) {
      const caseToUpdate = formattedOpenCases.find(
        theCase => theCase.docketNumber === aCase.docketNumber,
      );
      if (caseToUpdate) {
        caseToUpdate.calendarNotes = aCase.calendarNotes;
      }
    }
  });

  const {
    formattedCourtReporter,
    formattedIrsCalendarAdministrator,
    formattedJudge,
    formattedStartDateFull,
    formattedStartTime,
    formattedTrialClerk,
  } = formattedTrialSession;

  const sessionDetail = {
    ...formattedTrialSession,
    courtReporter: formattedCourtReporter,
    irsCalendarAdministrator: formattedIrsCalendarAdministrator,
    judge: formattedJudge,
    startDate: formattedStartDateFull,
    startTime: formattedStartTime,
    trialClerk: formattedTrialClerk,
  };

  const file = await applicationContext.getDocumentGenerators().trialCalendar({
    applicationContext,
    data: {
      cases: formattedOpenCases,
      sessionDetail,
    },
  });

  return await saveFileAndGenerateUrl({
    applicationContext,
    file,
    useTempBucket: true,
  });
};
