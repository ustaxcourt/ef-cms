export const chambersViewsTrialSessionWorkingCopy = test => {
  return it('Chambers views trial session working copy', async () => {
    await test.runSequence('gotoTrialSessionWorkingCopySequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('currentPage')).toEqual('TrialSessionWorkingCopy');
  });
};
