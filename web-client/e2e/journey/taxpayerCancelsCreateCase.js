export default test => {
  it('taxpayer navigates to create case and cancels', async () => {
    await test.runSequence('gotoStartCaseSequence');
    expect(test.getState('showModal')).toBeFalsy();
    expect(test.getState('form')).toEqual({ contactPrimary: {} });

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
