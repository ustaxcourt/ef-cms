import { runCompute } from 'cerebral/test';

import startCaseHelper from '../../src/presenter/computeds/startCaseHelper';

export default test => {
  it('taxpayer chooses the procedure types to get the trial cities', async () => {
    await test.runSequence('gotoStartCaseSequence');
    let helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(helper.showSmallTrialCitiesHint).toBe(false);
    expect(helper.showRegularTrialCitiesHint).toBe(false);
    expect(helper.trialCitiesByState['Alabama'][0]).toEqual(
      'Birmingham, Alabama',
    );
    expect(test.getState('form.preferredTrialCity')).toEqual(undefined);
    await test.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: 'Small',
    });
    helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(helper.showSmallTrialCitiesHint).toBe(true);
    expect(helper.showRegularTrialCitiesHint).toBe(false);
    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Chattanooga, TN',
    });
  });
};
