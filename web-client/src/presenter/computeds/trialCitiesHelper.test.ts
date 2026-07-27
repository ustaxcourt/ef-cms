import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { trialCitiesHelper as trialCitiesHelperComputed } from './trialCitiesHelper';
import { withAppContextDecorator } from '../../withAppContext';

const { TRIAL_SESSION_SCOPE_TYPES, US_STATES } =
  applicationContext.getConstants();

const trialCitiesHelper = withAppContextDecorator(trialCitiesHelperComputed, {
  ...applicationContext,
  getConstants: () => {
    return {
      NEW_TRIAL_CITY_STRINGS: [],
      TRIAL_CITIES: {
        ALL: [
          {
            city: 'Chattanooga',
            state: US_STATES.TN,
          },
          {
            city: 'New York City',
            state: US_STATES.NY,
          },
          { city: 'Oklahoma City', state: US_STATES.OK },
          {
            city: 'Orange County',
            state: US_STATES.NJ,
          },
        ],
        REGULAR: [
          {
            city: 'Chicago',
            state: US_STATES.IL,
          },
          { city: 'Oklahoma City', state: 'Oklahoma' },
        ],
        SMALL: [
          {
            city: 'Chattanooga',
            state: US_STATES.TN,
          },
          {
            city: 'Orange County',
            state: US_STATES.NJ,
          },
        ],
      },
      TRIAL_SESSION_SCOPE_TYPES,
    };
  },
});

describe('trialCitiesHelper should return a lists of trial cities ("Standalone Remote" optional) in an alphabetical order', () => {
  it('returns all the trial cities with Standalone Remote as the first option', () => {
    const result = runCompute(trialCitiesHelper, { state: {} });
    const trialCitiesResult = result('AllPlusStandalone');
    expect(trialCitiesResult).toEqual({
      shouldAddStandalone: true,
      trialCitiesByState: [
        { cities: [`Orange County, ${US_STATES.NJ}`], state: US_STATES.NJ },
        { cities: [`New York City, ${US_STATES.NY}`], state: US_STATES.NY },
        { cities: [`Oklahoma City, ${US_STATES.OK}`], state: US_STATES.OK },
        { cities: [`Chattanooga, ${US_STATES.TN}`], state: US_STATES.TN },
      ],
    });
  });

  it('returns all the trial cities to correspond to the "Small" parameter', () => {
    const result = runCompute(trialCitiesHelper, { state: {} });
    const trialCitiesResult = result('Small');
    expect(trialCitiesResult).toEqual({
      shouldAddStandalone: false,
      trialCitiesByState: [
        {
          cities: ['Orange County, New Jersey'],
          state: US_STATES.NJ,
        },
        { cities: ['Chattanooga, Tennessee'], state: US_STATES.TN },
      ],
    });
  });

  it('returns all trialCitiesByState if param is "All"', () => {
    const result = runCompute(trialCitiesHelper, { state: {} });
    const trialCitiesResult = result('All');
    expect(trialCitiesResult).toEqual({
      shouldAddStandalone: false,
      trialCitiesByState: [
        { cities: [`Orange County, ${US_STATES.NJ}`], state: US_STATES.NJ },
        { cities: [`New York City, ${US_STATES.NY}`], state: US_STATES.NY },
        { cities: [`Oklahoma City, ${US_STATES.OK}`], state: US_STATES.OK },
        { cities: [`Chattanooga, ${US_STATES.TN}`], state: US_STATES.TN },
      ],
    });
  });

  it('returns regular trialCitiesByState if param is "Regular"', () => {
    const result = runCompute(trialCitiesHelper, { state: {} });
    const trialCitiesResult = result('Regular');
    expect(trialCitiesResult).toEqual({
      shouldAddStandalone: false,
      trialCitiesByState: [
        { cities: ['Chicago, Illinois'], state: US_STATES.IL },
        { cities: ['Oklahoma City, Oklahoma'], state: US_STATES.OK },
      ],
    });
  });

  it('returns regular trialCitiesByState by default if param is not "small" or "all"', () => {
    const result = runCompute(trialCitiesHelper, { state: {} });
    const trialCitiesResult = result('not small or all');
    expect(trialCitiesResult).toEqual({
      shouldAddStandalone: false,
      trialCitiesByState: [
        { cities: ['Chicago, Illinois'], state: US_STATES.IL },
        { cities: ['Oklahoma City, Oklahoma'], state: US_STATES.OK },
      ],
    });
  });
});

describe('trialCitiesHelper with the real trial-city registry - DAW-10170 feature-flag gate', () => {
  const trialCitiesHelperReal = withAppContextDecorator(
    trialCitiesHelperComputed,
  );

  const NEW_CITIES = [
    'Austin, Texas',
    'Charlotte, North Carolina',
    'Newark, New Jersey',
    'Orlando, Florida',
    'Sacramento, California',
  ];

  const flattenCityList = (result: {
    trialCitiesByState: { cities: string[]; state: string }[];
  }): string[] =>
    result.trialCitiesByState.flatMap(stateGroup => stateGroup.cities);

  it('exposes the DAW-10170 cities in "All" when the feature flag is enabled', () => {
    const result = runCompute(trialCitiesHelperReal, {
      state: { featureFlags: { 'new-trial-cities-enabled': true } },
    });
    const trialCitiesResult = result('All');

    expect(flattenCityList(trialCitiesResult)).toEqual(
      expect.arrayContaining(NEW_CITIES),
    );
  });

  it('hides the DAW-10170 cities in "All" when the feature flag is disabled', () => {
    const result = runCompute(trialCitiesHelperReal, {
      state: { featureFlags: { 'new-trial-cities-enabled': false } },
    });
    const trialCitiesResult = result('All');

    expect(flattenCityList(trialCitiesResult)).not.toEqual(
      expect.arrayContaining(NEW_CITIES),
    );
  });

  it('hides the DAW-10170 cities in "Regular" when the feature flag is disabled', () => {
    const result = runCompute(trialCitiesHelperReal, {
      state: { featureFlags: { 'new-trial-cities-enabled': false } },
    });
    const trialCitiesResult = result('Regular');

    expect(flattenCityList(trialCitiesResult)).not.toEqual(
      expect.arrayContaining(NEW_CITIES),
    );
  });

  it('defaults to hiding the DAW-10170 cities when state.featureFlags is undefined', () => {
    const result = runCompute(trialCitiesHelperReal, { state: {} });
    const trialCitiesResult = result('All');

    expect(flattenCityList(trialCitiesResult)).not.toEqual(
      expect.arrayContaining(NEW_CITIES),
    );
  });
});
