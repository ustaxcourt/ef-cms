import { applicationContext } from '../../applicationContext';
import { getTrialCityName } from './formattedTrialCity';
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
          {
            city: 'Standalone Remote',
            state: 'Standalone Remote',
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
    const result = runCompute(trialCitiesHelper, {
      state: {},
    });
    const trialCitiesResult = result('Small');
    expect(trialCitiesResult).toMatchObject({
      trialCitiesByState: { Tennessee: ['Chattanooga, Tennessee'] },
    });
  });

  it('returns trialCitiesByState with Standalone Remote as the first key and value', () => {
    const result = runCompute(trialCitiesHelper);
    const trialCitiesResult = JSON.stringify(result());

    expect(trialCitiesResult).toEqual(
      JSON.stringify({
        trialCitiesByState: {
          Illinois: ['Chicago, Illinois'],
          Oklahoma: ['Oklahoma City, Oklahoma'],
          'Standalone Remote': ['Standalone Remote'],
        },
      }),
    );
  });

  it('returns all trialCitiesByState if param is "All"', () => {
    const result = runCompute(trialCitiesHelper, {
      state: {},
    });
    const trialCitiesResult = result('All');
    expect(trialCitiesResult).toMatchObject({
      trialCitiesByState: { Tennessee: ['Chattanooga, Tennessee'] },
    });
  });

  it('returns regular trialCitiesByState if param is "Regular"', () => {
    const result = runCompute(trialCitiesHelper, {
      state: {
        getTrialCityName,
      },
    });
    const trialCitiesResult = result('Regular');
    expect(trialCitiesResult).toMatchObject({
      trialCitiesByState: { Illinois: ['Chicago, Illinois'] },
    });
  });

  it('returns regular trialCitiesByState by default if param is not "small" or "all"', () => {
    const result = runCompute(trialCitiesHelper, {
      state: {
        getTrialCityName,
      },
    });
    const trialCitiesResult = result('not small or all');
    expect(trialCitiesResult).toMatchObject({
      trialCitiesByState: { Illinois: ['Chicago, Illinois'] },
    });
  });
});
