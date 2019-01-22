import { runCompute } from 'cerebral/test';

import startCaseHelper from '../../presenter/computeds/startCaseHelper';

export default test => {
  it('taxpayer chooses the procedure types to get the trial cities', async () => {
    await test.runSequence('gotoStartCaseSequence');
    let helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(helper.trialCities).toEqual([]);
    expect(helper.trialCities.length).toEqual(0);
    await test.runSequence('getTrialCitiesSequence', {
      value: 'Small',
    });
    helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(helper.trialCities.length).toBeGreaterThan(0);
    expect(helper.showSmallTrialCitiesHint).toBe(true);
    expect(helper.showRegularTrialCitiesHint).toBe(false);
    expect(helper.trialCities[0].city).not.toBeNull();
    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Chattanooga, TN',
    });
    await test.runSequence('getTrialCitiesSequence', {
      value: 'Regular',
    });
    helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(helper.trialCities.length).toBeGreaterThan(0);
    expect(helper.showSmallTrialCitiesHint).toBe(false);
    expect(helper.showRegularTrialCitiesHint).toBe(true);
    expect(helper.trialCities[0].city).not.toBeNull();
    expect(test.getState('form.preferredTrialCity')).toEqual('');
    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Chattanooga, TN',
    });
  });
};
