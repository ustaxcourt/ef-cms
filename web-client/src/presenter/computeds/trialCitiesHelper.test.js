import { runCompute } from 'cerebral/test';

import { trialCitiesHelper } from './trialCitiesHelper';
import { getTrialCityName } from './formattedTrialCity';

describe('trialCitiesHelper', () => {
  it('returns trialCitiesByState which is an object of state => city pairs', async () => {
    const result = await runCompute(trialCitiesHelper, {
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
    const trailCitiesByState = result('Small');
    expect(trailCitiesByState).toMatchObject({
      trialCitiesByState: { Tennessee: ['Chattanooga, Tennessee'] },
    });
  });
});
