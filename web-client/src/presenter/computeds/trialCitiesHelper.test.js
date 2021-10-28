import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { trialCitiesHelper as trialCitiesHelperComputed } from './trialCitiesHelper';
import { withAppContextDecorator } from '../../withAppContext';

const { US_STATES } = applicationContext.getConstants();

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
        ],
      },
    };
  },
});

describe('trialCitiesHelper', () => {
  it('returns trialCitiesByState which is an object of state => city pairs', () => {
    const result = runCompute(trialCitiesHelper);
    //JSON.stringify to look for the order of the keys
    const trialCitiesResult = JSON.stringify(result('Small'));
    expect(trialCitiesResult).toEqual(
      JSON.stringify({
        trialCitiesByState: {
          'Standalone Remote': ['Standalone Remote'],
          Tennessee: ['Chattanooga, Tennessee'],
        },
      }),
    );
  });

  it('returns trialCitiesByState with Standalone Remote as the first key and value', () => {
    const result = runCompute(trialCitiesHelper);
    //JSON.stringify to look for the order of the keys
    const trialCitiesResult = JSON.stringify(result());
    // disable eslint to keep order of keys
    /* eslint-disable */
    expect(trialCitiesResult).toEqual(
      JSON.stringify({
        trialCitiesByState: {
          'Standalone Remote': ['Standalone Remote'],
          Illinois: ['Chicago, Illinois'],
          Oklahoma: ['Oklahoma City, Oklahoma'],
        },
      }),
    );
    /* eslint-enable */
  });

  it('returns all trialCitiesByState if param is "All"', () => {
    const result = runCompute(trialCitiesHelper);
    //JSON.stringify to look for the order of the keys
    const trialCitiesResult = JSON.stringify(result('All'));
    expect(trialCitiesResult).toEqual(
      JSON.stringify({
        trialCitiesByState: {
          'Standalone Remote': ['Standalone Remote'],
          Tennessee: ['Chattanooga, Tennessee'],
        },
      }),
    );
  });

  it('returns regular trialCitiesByState if param is "Regular"', () => {
    const result = runCompute(trialCitiesHelper);
    //JSON.stringify to look for the order of the keys

    const trialCitiesResult = JSON.stringify(result('Regular'));
    /* eslint-disable */
    expect(trialCitiesResult).toEqual(
      JSON.stringify({
        trialCitiesByState: {
          'Standalone Remote': ['Standalone Remote'],
          Illinois: ['Chicago, Illinois'],
          Oklahoma: ['Oklahoma City, Oklahoma'],
        },
      }),
    );
    /* eslint-enable */
  });

  it('returns regular trialCitiesByState by default if param is not "small" or "all"', () => {
    const result = runCompute(trialCitiesHelper);
    //JSON.stringify to look for the order of the keys
    const trialCitiesResult = JSON.stringify(result('not small or all'));
    /* eslint-disable */
    expect(trialCitiesResult).toEqual(
      JSON.stringify({
        trialCitiesByState: {
          'Standalone Remote': ['Standalone Remote'],
          Illinois: ['Chicago, Illinois'],
          Oklahoma: ['Oklahoma City, Oklahoma'],
        },
      }),
    );
    /* eslint-enable */
  });
});
