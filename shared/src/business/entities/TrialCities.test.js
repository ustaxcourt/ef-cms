const { TRIAL_CITIES } = require('./TrialCities');

describe('TrialCities', () => {
  it('exports SMALL cities', () => {
    expect(TRIAL_CITIES.SMALL).toBeDefined();
    expect(Array.isArray(TRIAL_CITIES.SMALL)).toBeTruthy();
  });
  it('exports REGULAR cities', () => {
    expect(TRIAL_CITIES.REGULAR).toBeDefined();
    expect(Array.isArray(TRIAL_CITIES.REGULAR)).toBeTruthy();
  });
});
