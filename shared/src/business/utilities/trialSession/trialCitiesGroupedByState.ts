import { TRIAL_CITIES } from '@shared/business/entities/EntityConstants';
import { sortBy } from 'lodash';

export const getTrialCitiesGroupedByState = (): {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}[] => {
  const trialCities = sortBy(TRIAL_CITIES.ALL, ['state', 'city']);
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
