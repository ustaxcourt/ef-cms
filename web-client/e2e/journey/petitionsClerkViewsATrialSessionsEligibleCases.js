export default test => {
  return it('Petitions Clerk Views A Trial Sessions Eligible Cases', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('eligibleCases').length).toBeGreaterThan(4);
    expect(test.getState('trialSession.status')).toEqual('Upcoming');
  });
};
