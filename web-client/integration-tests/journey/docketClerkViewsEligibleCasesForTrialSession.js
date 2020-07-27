export const docketClerkViewsEligibleCasesForTrialSession = test => {
  return it('Docket clerk views eligible cases for a trial session', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('trialSession.eligibleCases').length).toEqual(1);
    expect(test.getState('trialSession.eligibleCases.0.docketNumber')).toEqual(
      test.docketNumber,
    );
  });
};
