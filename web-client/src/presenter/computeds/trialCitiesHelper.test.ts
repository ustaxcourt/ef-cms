import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
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
          { city: 'Austin', state: 'Texas' },
        ],
        REGULAR: [
          {
            city: 'Chicago',
            state: US_STATES.IL,
          },
          { city: 'Oklahoma City', state: 'Oklahoma' },
          { city: 'Austin', state: 'Texas' },
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

const NEW_TRIAL_CITIES_FLAG_KEY = ALLOWLIST_FEATURE_FLAGS.NEW_TRIAL_CITIES.key;

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

  describe('new-trial-cities feature flag', () => {
    it('should exclude new trial cities from "All" when flag is false', () => {
      const result = runCompute(trialCitiesHelper, {
        state: { featureFlags: { [NEW_TRIAL_CITIES_FLAG_KEY]: false } },
      });
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

    it('should include new trial cities in "All" when flag is true', () => {
      const result = runCompute(trialCitiesHelper, {
        state: { featureFlags: { [NEW_TRIAL_CITIES_FLAG_KEY]: true } },
      });
      const trialCitiesResult = result('All');
      expect(trialCitiesResult).toEqual({
        shouldAddStandalone: false,
        trialCitiesByState: [
          { cities: [`Orange County, ${US_STATES.NJ}`], state: US_STATES.NJ },
          { cities: [`New York City, ${US_STATES.NY}`], state: US_STATES.NY },
          { cities: [`Oklahoma City, ${US_STATES.OK}`], state: US_STATES.OK },
          { cities: [`Chattanooga, ${US_STATES.TN}`], state: US_STATES.TN },
          { cities: ['Austin, Texas'], state: 'Texas' },
        ],
      });
    });

    it('should exclude new trial cities from "Regular" when flag is false', () => {
      const result = runCompute(trialCitiesHelper, {
        state: { featureFlags: { [NEW_TRIAL_CITIES_FLAG_KEY]: false } },
      });
      const trialCitiesResult = result('Regular');
      expect(trialCitiesResult).toEqual({
        shouldAddStandalone: false,
        trialCitiesByState: [
          { cities: ['Chicago, Illinois'], state: US_STATES.IL },
          { cities: ['Oklahoma City, Oklahoma'], state: US_STATES.OK },
        ],
      });
    });

    it('should include new trial cities in "Regular" when flag is true', () => {
      const result = runCompute(trialCitiesHelper, {
        state: { featureFlags: { [NEW_TRIAL_CITIES_FLAG_KEY]: true } },
      });
      const trialCitiesResult = result('Regular');
      expect(trialCitiesResult).toEqual({
        shouldAddStandalone: false,
        trialCitiesByState: [
          { cities: ['Chicago, Illinois'], state: US_STATES.IL },
          { cities: ['Oklahoma City, Oklahoma'], state: US_STATES.OK },
          { cities: ['Austin, Texas'], state: 'Texas' },
        ],
      });
    });
  });
});
