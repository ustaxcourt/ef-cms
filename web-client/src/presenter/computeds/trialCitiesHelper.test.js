import { getTrialCityName } from './formattedTrialCity';
import { runCompute } from 'cerebral/test';
import { trialCitiesHelper } from './trialCitiesHelper';

describe('trialCitiesHelper', () => {
  it('returns trialCitiesByState which is an object of state => city pairs', () => {
    const result = runCompute(trialCitiesHelper, {
      state: {
        constants: {
          TRIAL_CITIES: {
            SMALL: [
              {
                city: 'Chattanooga',
                state: 'Tennessee',
              },
            ],
          },
        },
        getTrialCityName,
      },
    });
    const trialCitiesResult = result('Small');
    expect(trialCitiesResult).toMatchObject({
      trialCitiesByState: { Tennessee: ['Chattanooga, Tennessee'] },
    });
  });

  it('returns all trialCitiesByState if param is "All"', () => {
    const result = runCompute(trialCitiesHelper, {
      state: {
        constants: {
          TRIAL_CITIES: {
            ALL: [
              {
                city: 'Chattanooga',
                state: 'Tennessee',
              },
            ],
          },
        },
        getTrialCityName,
      },
    });
    const trialCitiesResult = result('All');
    expect(trialCitiesResult).toMatchObject({
      trialCitiesByState: { Tennessee: ['Chattanooga, Tennessee'] },
    });
  });

  it('returns regular trialCitiesByState if param is "Regular"', () => {
    const result = runCompute(trialCitiesHelper, {
      state: {
        constants: {
          TRIAL_CITIES: {
            REGULAR: [
              {
                city: 'Chicago',
                state: 'Illinois',
              },
            ],
          },
        },
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
        constants: {
          TRIAL_CITIES: {
            REGULAR: [
              {
                city: 'Chicago',
                state: 'Illinois',
              },
            ],
          },
        },
        getTrialCityName,
      },
    });
    const trialCitiesResult = result('not small or all');
    expect(trialCitiesResult).toMatchObject({
      trialCitiesByState: { Illinois: ['Chicago, Illinois'] },
    });
  });
});
