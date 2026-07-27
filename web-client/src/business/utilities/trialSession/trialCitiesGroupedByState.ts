import {
  NEW_TRIAL_CITY_STRINGS,
  TRIAL_CITIES,
} from '@shared/business/entities/EntityConstants';
import { sortBy } from 'lodash';

type TrialCity = { city: string; state: string };

export const getTrialCitiesForFeatureFlag = ({
  newTrialCitiesEnabled,
  trialCities,
}: {
  newTrialCitiesEnabled: boolean;
  trialCities: TrialCity[];
}): TrialCity[] => {
  if (newTrialCitiesEnabled) return trialCities;

  return trialCities.filter(trialCity => {
    const trialCityName = `${trialCity.city}, ${trialCity.state}`;

    return !NEW_TRIAL_CITY_STRINGS.includes(trialCityName);
  });
};

export const getTrialCitiesGroupedByState = (
  newTrialCitiesEnabled: boolean = false,
): {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}[] => {
  const trialCities = sortBy(
    getTrialCitiesForFeatureFlag({
      newTrialCitiesEnabled,
      trialCities: TRIAL_CITIES.ALL,
    }),
    ['state', 'city'],
  );
  const states = trialCities.reduce(
    (listOfStates, cityStatePair) => {
      const existingState = listOfStates.find(
        trialState => trialState.label === cityStatePair.state,
      );
      const cityOption = {
        label: `${cityStatePair.city}, ${cityStatePair.state}`,
        value: `${cityStatePair.city}, ${cityStatePair.state}`,
      };
      if (existingState) {
        existingState.options.push(cityOption);
      } else {
        listOfStates.push({
          label: cityStatePair.state,
          options: [cityOption],
        });
      }
      return listOfStates;
    },
    [] as {
      label: string;
      options: { label: string; value: string }[];
    }[],
  );

  return states;
};
