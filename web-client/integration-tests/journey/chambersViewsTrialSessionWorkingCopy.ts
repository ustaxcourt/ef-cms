export const chambersViewsTrialSessionWorkingCopy = cerebralTest => {
  return it('Chambers views trial session working copy', async () => {
    await cerebralTest.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'TrialSessionWorkingCopy',
    );
  });
};
