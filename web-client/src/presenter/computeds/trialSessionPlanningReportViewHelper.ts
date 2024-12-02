import { PreviousTerm } from '@web-api/business/useCases/trialSessions/runTrialSessionPlanningReportInteractor';
import { state } from '@web-client/presenter/app.cerebral';

type TrialSessionPlanningReportViewHelperResults = {
  citiesNotCalendaredInTwoPreviousTerms: string[][];
  trialSessionPlanningReportHeader: string;
  previousTermsFormatted: PreviousTerm & { termDisplayFormatted }[];
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
  const { previousTerms, trialLocationData, trialTerm, trialYear } = get(
    state.trialSessionPlanningReportData,
  );

  const ALL_CITIES_NOT_CALENDARED: string[] = trialLocationData
    .filter(locationData => {
      return (
        !locationData.previousTermsData[1].length &&
        !locationData.previousTermsData[2].length
      );
    })
    .map(locationData => locationData.trialCityState)
    .sort();

  const trialSessionPlanningReportHeader = `${formatTerm(trialTerm)} ${trialYear}`;

  const previousTermsFormatted = previousTerms.map(prevTerm => {
    return {
      ...prevTerm,
      termDisplayFormatted: `${formatTerm(prevTerm.term)} '${prevTerm.year.toString().slice(-2)}`,
    };
  });

  return {
    citiesNotCalendaredInTwoPreviousTerms: formatCities(
      ALL_CITIES_NOT_CALENDARED,
    ),
    previousTermsFormatted,
    trialSessionPlanningReportHeader,
  };
};
