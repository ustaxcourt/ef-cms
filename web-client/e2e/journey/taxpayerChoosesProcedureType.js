import { runCompute } from 'cerebral/test';

import { startCaseHelper } from '../../src/presenter/computeds/startCaseHelper';

export default (test, overrides = {}) => {
  it('taxpayer chooses the procedure types to get the trial cities', async () => {
    await test.runSequence('gotoStartCaseSequence');
    let helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(helper.showSmallTrialCitiesHint).toBe(false);
    expect(helper.showRegularTrialCitiesHint).toBe(false);
    expect(test.getState('form.preferredTrialCity')).toEqual(undefined);
    await test.runSequence('updateFormValueSequence', {
      key: 'procedureType',
      value: overrides.procedureType || 'Small',
    });
    helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    if (overrides.procedureType === 'Regular') {
      expect(helper.showSmallTrialCitiesHint).toBe(false);
      expect(helper.showRegularTrialCitiesHint).toBe(true);
    } else {
      expect(helper.showSmallTrialCitiesHint).toBe(true);
      expect(helper.showRegularTrialCitiesHint).toBe(false);
    }
    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: overrides.preferredTrialCity || 'Seattle, Washington',
    });
  });
};
