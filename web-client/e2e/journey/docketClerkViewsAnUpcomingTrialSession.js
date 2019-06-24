export default test => {
  return it('Docket Clerk Views An Upcoming Trial Session', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('trialSession.status')).toEqual('Upcoming');
  });
};
