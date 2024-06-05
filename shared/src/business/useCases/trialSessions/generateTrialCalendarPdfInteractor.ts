import { NotFoundError } from '@web-api/errors/errors';
import { compact } from 'lodash';
import { compareCasesByDocketNumberFactory } from '../../utilities/getFormattedTrialSessionDetails';
import { formatDateString } from '@shared/business/utilities/DateHandler';
import { saveFileAndGenerateUrl } from '../../../../../web-api/src/business/useCaseHelper/saveFileAndGenerateUrl';

export const generateTrialCalendarPdfInteractor = async (
  applicationContext: IApplicationContext,
  { trialSessionId }: { trialSessionId: string },
): Promise<{ fileId: string; url: string }> => {
  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const calendaredCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  const formattedOpenCases = formatCases({
    applicationContext,
    calendaredCases,
  });

  const formattedCityStateZip = compact([
    trialSession.city ? `${trialSession.city},` : undefined,
    trialSession.state,
    trialSession.postalCode,
  ]).join(' ');

  let startTimeFormatted;
  if (trialSession.startTime) {
    let [hour, min]: any = trialSession.startTime.split(':');
    let startTimeExtension = +hour >= 12 ? 'pm' : 'am';

    if (+hour > 12) {
      hour = +hour - 12;
    }

    startTimeFormatted = `${hour}:${min} ${startTimeExtension}`;
  }

  const file = await applicationContext.getDocumentGenerators().trialCalendar({
    applicationContext,
    data: {
      cases: formattedOpenCases,
      sessionDetail: {
        address1: trialSession.address1,
        address2: trialSession.address2,
        chambersPhoneNumber: trialSession.chambersPhoneNumber,
        courtReporter: trialSession.courtReporter || 'Not assigned',
        courthouseName: trialSession.courthouseName,
        formattedCityStateZip,
        irsCalendarAdministrator:
          trialSession.irsCalendarAdministrator || 'Not assigned',
        irsCalendarAdministratorInfo: trialSession.irsCalendarAdministratorInfo,
        joinPhoneNumber: trialSession.joinPhoneNumber,
        judge: trialSession.judge?.name || 'Not assigned',
        meetingId: trialSession.meetingId,
        notes: trialSession.notes,
        password: trialSession.password,
        proceedingType: trialSession.proceedingType,
        sessionType: trialSession.sessionType,
        startDate: formatDateString(trialSession.startDate, 'MONTH_DAY_YEAR'),
        startTime: startTimeFormatted,
        trialClerk:
          trialSession.trialClerk?.name ||
          trialSession.alternateTrialClerkName ||
          'Not assigned',
        trialLocation: trialSession.trialLocation,
      },
    },
  });

  return await saveFileAndGenerateUrl({
    applicationContext,
    file,
    useTempBucket: true,
  });
};

const formatCases = ({ applicationContext, calendaredCases }) => {
  const openCases = calendaredCases.filter(
    calendaredCase => !calendaredCase.removedFromTrial,
  );
  return openCases
    .sort(compareCasesByDocketNumberFactory({ allCases: openCases }))
    .map(openCase => {
      const { inConsolidatedGroup, isLeadCase, shouldIndent } =
        applicationContext
          .getUtilities()
          .setConsolidationFlagsForDisplay(openCase, openCases);

      return {
        calendarNotes: openCase.calendarNotes,
        caseTitle: applicationContext.getCaseTitle(openCase.caseCaption),
        docketNumber: openCase.docketNumber,
        docketNumberWithSuffix: openCase.docketNumberWithSuffix,
        inConsolidatedGroup,
        isLeadCase,
        petitionerCounsel:
          openCase.privatePractitioners.map(getPractitionerName),
        respondentCounsel: openCase.irsPractitioners.map(getPractitionerName),
        shouldIndent,
      };
    });
};

const getPractitionerName = practitioner => {
  const { barNumber, name } = practitioner;

  return `${name} (${barNumber})`;
};
