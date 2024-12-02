import { state } from '@web-client/presenter/app.cerebral';

type TrialSessionPlanningReportViewHelperResults = {
  citiesNotCalendaredInTwoPreviousTerms: CityInfo[][];
  trialSessionPlanningReportHeader: string;
};

export type CityInfo = { city: string; state: string };

function formatCities(allCities: CityInfo[]): CityInfo[][] {
  const NUMBER_OF_COLUMNS = 4;
  const equalParts = Math.floor(allCities.length / NUMBER_OF_COLUMNS);
  const remainderCount = allCities.length % NUMBER_OF_COLUMNS;
  const results = Array.from(
    { length: NUMBER_OF_COLUMNS },
    () => [] as CityInfo[],
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
  const ALL_CITIES_NOT_CALENDARED = Array.from({ length: 20 }, (_, index) => ({
    city: `${index}_TEST_CITY`,
    state: 'TEST_STATE',
  })).sort((a, b) => {
    if (a.city < b.city) return -1;
    if (a.city > b.city) return 1;
    return 0;
  });

  const { trialTerm, trialYear } = get(state.trialSessionPlanningReportData);
  const trialSessionPlanningReportHeader = `${formatTerm(trialTerm)} ${trialYear}`;

  return {
    citiesNotCalendaredInTwoPreviousTerms: formatCities(
      ALL_CITIES_NOT_CALENDARED,
    ),
    trialSessionPlanningReportHeader,
  };
};
