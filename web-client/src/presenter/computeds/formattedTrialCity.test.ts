import { getTrialCityName as getTrialCityNameComputed } from './formattedTrialCity';
import { runCompute } from '@web-client/presenter/test.cerebral';

describe('getTrialCityName', () => {
  it('returns the properlly formatted trial city name', () => {
    const getTrialCityName = runCompute(getTrialCityNameComputed);

    expect(
      getTrialCityName({
        city: 'Orlando',
        state: 'Florida',
      }),
    ).toContain('Orlando, Florida');
  });
});
