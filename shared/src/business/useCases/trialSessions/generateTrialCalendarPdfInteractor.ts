import { compact } from 'lodash';
import { compareCasesByDocketNumber } from '../../utilities/getFormattedTrialSessionDetails';
import { formatDateString } from '@shared/business/utilities/DateHandler';
import { saveFileAndGenerateUrl } from '../../useCaseHelper/saveFileAndGenerateUrl';

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

  let [hour, min]: any = trialSession.startTime.split(':');
  let startTimeExtension = +hour >= 12 ? 'pm' : 'am';

  if (+hour > 12) {
    hour = +hour - 12;
  }

  const file = await applicationContext.getDocumentGenerators().trialCalendar({
    applicationContext,
    data: {
      cases: formattedOpenCases,
      sessionDetail: {
        address1: trialSession.address1,
        address2: trialSession.address2,
        courtReporter: trialSession.courtReporter || 'Not assigned',
        courthouseName: trialSession.courthouseName,
        formattedCityStateZip,
        irsCalendarAdministrator:
          trialSession.irsCalendarAdministrator || 'Not assigned',
        judge: trialSession.judge?.name || 'Not assigned',
        noLocationEntered:
          !trialSession.courthouseName &&
          !trialSession.address1 &&
          !trialSession.address2 &&
          !formattedCityStateZip,
        notes: trialSession.notes,
        sessionType: trialSession.sessionType,
        startDate: formatDateString(trialSession.startDate, 'MONTH_DAY_YEAR'),
        startTime: `${hour}:${min} ${startTimeExtension}`,
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

export const getPractitionerName = practitioner => {
  const { barNumber, name } = practitioner;
  const barNumberFormatted = barNumber ? ` (${barNumber})` : '';
  return `${name}${barNumberFormatted}`;
};

export const formatCases = ({ applicationContext, calendaredCases }) => {
  const formattedOpenCases = calendaredCases
    .filter(calendaredCase => !calendaredCase.removedFromTrial)
    .sort(compareCasesByDocketNumber)
    .map(openCase => {
      return {
        caseTitle: applicationContext.getCaseTitle(openCase.caseCaption || ''),
        docketNumber: openCase.docketNumber,
        docketNumberWithSuffix: openCase.docketNumberWithSuffix,
        inConsolidatedGroup: openCase.inConsolidatedGroup,
        isLeadCase: openCase.isLeadCase,
        petitionerCounsel: (openCase.privatePractitioners || []).map(
          getPractitionerName,
        ),
        respondentCounsel: (openCase.irsPractitioners || []).map(
          getPractitionerName,
        ),
      };
    });
  return formattedOpenCases;
};
