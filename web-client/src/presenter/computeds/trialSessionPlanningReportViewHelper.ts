import {
  FORMATS,
  createDateAtStartOfWeekEST,
} from '@shared/business/utilities/DateHandler';
import { TrialLocationData } from '@web-api/business/useCases/trialSessions/getTrialSessionPlanningReportDataInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export type TrialLocationDataFormatted = TrialLocationData & {
  hasNotBeenCalendared: boolean;
  lastVisitedDateFormatted: string;
};

type TrialSessionPlanningReportViewHelperResults = {
  citiesNotCalendaredInTwoPreviousTerms: string[][];
  trialSessionPlanningReportHeader: string;
  previousTermsFormatted: { termDisplayFormatted }[];
  trialLocationDataFormatted: TrialLocationDataFormatted[];
};

function formatCities(allCities: string[]): string[][] {
  const NUMBER_OF_COLUMNS = 4;
  const equalParts = Math.floor(allCities.length / NUMBER_OF_COLUMNS);
  const remainderCount = allCities.length % NUMBER_OF_COLUMNS;
  const results = Array.from(
    { length: NUMBER_OF_COLUMNS },
    () => [] as string[],
  );

  for (let index = 0; index < NUMBER_OF_COLUMNS; index++) {
    const poppedElements = allCities.splice(0, equalParts);
    results[index].push(...poppedElements);

    if (remainderCount < 0) continue;
    if (index >= remainderCount) continue;
    const remainingElement = allCities.splice(0, 1);
    results[index].push(...remainingElement);
  }

  return results;
}

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
      termDisplayFormatted: `${formatTerm(prevTerm.term)} '${prevTerm.year.toString().slice(-2)}`,
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
      };
    });

  return {
    citiesNotCalendaredInTwoPreviousTerms: formatCities(
      ALL_CITIES_NOT_CALENDARED,
    ),
    previousTermsFormatted,
    trialLocationDataFormatted,
    trialSessionPlanningReportHeader,
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
