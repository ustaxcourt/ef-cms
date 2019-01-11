import { runCompute } from 'cerebral/test';

import startCaseHelper from '../../presenter/computeds/startCaseHelper';

export default test => {
  it('taxpayer chooses the procedure types to get the trial cities', async () => {
    await test.runSequence('gotoStartCaseSequence');
    const helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(helper.trialCities).toEqual([]);

    expect(helper.showDocumentStatus).toEqual(true);
    expect(helper.trialCities.length).toEqual(0);
    await test.runSequence('getTrialCitiesSequence', {
      value: 'small',
    });
    expect(helper.trialCities.length).toBeGreaterThan(0);
    expect(helper.trialCities[0].city).not.toBeNull();
    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Chattanooga, TN',
    });
    await test.runSequence('getTrialCitiesSequence', {
      value: 'large',
    });
    expect(helper.trialCities.length).toBeGreaterThan(0);
    expect(helper.trialCities[0].city).not.toBeNull();
    expect(test.getState('form.preferredTrialCity')).toEqual('');
    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Chattanooga, TN',
    });
  });
};
