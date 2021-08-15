export const petitionerCancelsCreateCase = cerebralTest => {
  it('petitioner navigates to create case and cancels', async () => {
    await cerebralTest.runSequence('gotoStartCaseWizardSequence', {
      step: '1',
      wizardStep: 'StartCaseStep1',
    });
    expect(cerebralTest.getState('modal.showModal')).toBeFalsy();
    expect(cerebralTest.getState('form')).toEqual({
      contactPrimary: {},
      wizardStep: '1',
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'preferredTrialCity',
      value: 'Seattle, Washington',
    });
    expect(cerebralTest.getState('form.preferredTrialCity')).toEqual(
      'Seattle, Washington',
    );

    await cerebralTest.runSequence('formCancelToggleCancelSequence'); // someone clicks cancel
    expect(cerebralTest.getState('modal.showModal')).toBeTruthy();
    await cerebralTest.runSequence('formCancelToggleCancelSequence'); // someone aborts cancellation
    expect(cerebralTest.getState('currentPage')).toEqual('StartCaseWizard');

    await cerebralTest.runSequence('formCancelToggleCancelSequence');
    await cerebralTest.runSequence('closeModalAndReturnToDashboardSequence');
    expect(cerebralTest.getState('modal.showModal')).toBeFalsy();
    expect(cerebralTest.getState('currentPage')).toEqual('DashboardPetitioner');
  });
};
