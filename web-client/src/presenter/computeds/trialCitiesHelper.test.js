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
          {
            city: 'New York City',
            state: US_STATES.NY,
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
  it('returns trialCitiesByState if param is "Small"', () => {
    const result = runCompute(trialCitiesHelper);
    const trialCitiesResult = result('Small');
    expect(trialCitiesResult).toEqual({
      trialCitiesByState: [
        'Standalone Remote',
        { cities: ['Chattanooga, Tennessee'], state: US_STATES.TN },
      ],
    });
  });

  it('returns all trialCitiesByState if param is "All"', () => {
    const result = runCompute(trialCitiesHelper);
    const trialCitiesResult = result('All');
    expect(trialCitiesResult).toEqual({
      trialCitiesByState: [
        'Standalone Remote',
        { cities: ['New York City, New York'], state: US_STATES.NY },
        { cities: ['Chattanooga, Tennessee'], state: US_STATES.TN },
      ],
    });
  });

  it('returns regular trialCitiesByState if param is "Regular"', () => {
    const result = runCompute(trialCitiesHelper);
    const trialCitiesResult = result('Regular');
    expect(trialCitiesResult).toEqual({
      trialCitiesByState: [
        'Standalone Remote',
        { cities: ['Chicago, Illinois'], state: US_STATES.IL },
        { cities: ['Oklahoma City, Oklahoma'], state: US_STATES.OK },
      ],
    });
  });

  it('returns regular trialCitiesByState by default if param is not "small" or "all"', () => {
    const result = runCompute(trialCitiesHelper);
    const trialCitiesResult = result('not small or all');
    expect(trialCitiesResult).toEqual({
      trialCitiesByState: [
        'Standalone Remote',
        { cities: ['Chicago, Illinois'], state: US_STATES.IL },
        { cities: ['Oklahoma City, Oklahoma'], state: US_STATES.OK },
      ],
    });
  });
});
