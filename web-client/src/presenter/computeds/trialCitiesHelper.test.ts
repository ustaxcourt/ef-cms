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
    const result = runCompute(trialCitiesHelper);
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
    const result = runCompute(trialCitiesHelper);
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
    const result = runCompute(trialCitiesHelper);
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
    const result = runCompute(trialCitiesHelper);
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
    const result = runCompute(trialCitiesHelper);
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
