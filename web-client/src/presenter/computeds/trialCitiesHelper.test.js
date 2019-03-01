import { runCompute } from 'cerebral/test';

import { trialCitiesHelper } from './trialCitiesHelper';
import { getTrialCityName } from './formattedTrialCity';

describe('trialCitiesHelper', () => {
  it('returns trialCitiesByState which is an object of state => city pairs', async () => {
    const result = await runCompute(trialCitiesHelper, {
      state: {
        trialCities: [
          {
            state: 'Tennessee',
            city: 'Chattanooga',
          },
        ],
        getTrialCityName,
      },
    });
    expect(result).toMatchObject({
      trialCitiesByState: { Tennessee: ['Chattanooga, Tennessee'] },
    });
  });
});
