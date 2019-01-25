import { runCompute } from 'cerebral/test';

import startCaseHelper from '../../src/presenter/computeds/startCaseHelper';

export default test => {
  it('taxpayer navigates to create case and cancels', async () => {
    let helper;

    await test.runSequence('gotoStartCaseSequence');
    helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(helper.trialCities.length).toBe(0);
    expect(test.getState('showModal')).toBeFalsy();
    expect(test.getState('form')).toEqual({});
    await test.runSequence('getTrialCitiesSequence', {
      value: 'Regular',
    });

    helper = runCompute(startCaseHelper, {
      state: test.getState(),
    });
    expect(helper.trialCities.length).toBeGreaterThan(0);

    await test.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Chattanooga, TN',
    });
    expect(test.getState('form.preferredTrialCity')).toEqual('Chattanooga, TN');

    await test.runSequence('startACaseToggleCancelSequence'); // someone clicks cancel
    expect(test.getState('showModal')).toBeTruthy();
    await test.runSequence('startACaseToggleCancelSequence'); // someone aborts cancellation
    expect(test.getState('currentPage')).toEqual('StartCase');

    await test.runSequence('startACaseToggleCancelSequence');
    await test.runSequence('startACaseConfirmCancelSequence');
    expect(test.getState('showModal')).toBeFalsy();
    expect(test.getState('currentPage')).toEqual('DashboardPetitioner');
  });
};
