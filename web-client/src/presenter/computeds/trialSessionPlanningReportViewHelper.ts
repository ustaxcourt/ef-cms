import {
  FORMATS,
  createDateAtStartOfWeekEST,
} from '@shared/business/utilities/DateHandler';
import { TrialLocationData } from '@shared/business/utilities/trialSessionPlanningReport/trialSessionPlanningReportDataTypes';
import { formatCities } from '@shared/business/utilities/pdfGenerator/documentTemplates/TrialSessionPlanningReport';
import { state } from '@web-client/presenter/app.cerebral';

export type TrialLocationDataFormatted = TrialLocationData & {
  hasNotBeenCalendared: boolean;
  lastVisitedDateFormatted: string;
  trialLocationUrl: string;
};

export type PreviousTermFormatted = {
  termDisplayFormatted: string;
  term: string;
  year: string;
};

type TrialSessionPlanningReportViewHelperResults = {
  citiesNotCalendaredInTwoPreviousTerms: string[][];
  trialSessionPlanningReportHeader: string;
  previousTermsFormatted: PreviousTermFormatted[];
  trialLocationDataFormatted: TrialLocationDataFormatted[];
  trialTerm: string;
  trialYear: string;
};

function formatTerm(trialTerm: string): string {
  if (!trialTerm) return '';
  const lowercased = trialTerm.toLowerCase().trim();
  return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
}

export const trialSessionPlanningReportViewHelper = (
  get,
): TrialSessionPlanningReportViewHelperResults => {
  const {
    previousTerms,
    trialLocationData,
    trialTerm,
    trialYear,
  }: typeof state.trialSessionPlanningReportData = get(
    state.trialSessionPlanningReportData,
  );

  const ALL_CITIES_NOT_CALENDARED: string[] = trialLocationData
    .filter(locationData => {
      return (
        !locationData.previousTermsData[0].length &&
        !locationData.previousTermsData[1].length
      );
    })
    .map(locationData => locationData.trialCityState)
    .sort();

  const trialSessionPlanningReportHeader = `${formatTerm(trialTerm)} ${trialYear}`;

  const previousTermsFormatted = previousTerms.map(prevTerm => {
    return {
      term: prevTerm.term,
      termDisplayFormatted: `${formatTerm(prevTerm.term)} ‘${prevTerm.year.toString().slice(-2)}`,
      year: prevTerm.year,
    };
  });

  const trialLocationDataFormatted =
    trialLocationData.map<TrialLocationDataFormatted>(locationData => {
      return {
        ...locationData,
        hasNotBeenCalendared: ALL_CITIES_NOT_CALENDARED.includes(
          locationData.trialCityState,
        ),
        lastVisitedDateFormatted: formatLastVisitedDate(
          locationData.lastVisitedDate,
        ),
        trialLocationUrl: `/trial-location/${locationData.trialCityState}`,
      };
    });

  return {
    citiesNotCalendaredInTwoPreviousTerms: formatCities(
      ALL_CITIES_NOT_CALENDARED,
    ),
    previousTermsFormatted,
    trialLocationDataFormatted,
    trialSessionPlanningReportHeader,
    trialTerm,
    trialYear,
  };
};

function formatLastVisitedDate(lastVisitedDate: string | undefined): string {
  if (!lastVisitedDate) return 'Never visited.';
  const formattedSessionWeekStartDate = createDateAtStartOfWeekEST(
    lastVisitedDate,
    FORMATS.MMDDYYYY,
  );
  return `Last visited week of ${formattedSessionWeekStartDate}`;
}
