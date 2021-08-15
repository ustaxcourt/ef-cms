export const docketClerkViewsEligibleCasesForTrialSession = cerebralTest => {
  return it('Docket clerk views eligible cases for a trial session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.eligibleCases').length).toEqual(
      1,
    );
    expect(
      cerebralTest.getState('trialSession.eligibleCases.0.docketNumber'),
    ).toEqual(cerebralTest.docketNumber);
  });
};
