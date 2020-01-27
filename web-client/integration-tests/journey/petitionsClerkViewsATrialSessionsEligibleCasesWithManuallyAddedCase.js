export default (test, expectedCount) => {
  return it('Petitions Clerk Views A Trial Sessions Eligible Cases', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    const eligibleCases = test.getState('trialSession.eligibleCases');

    expect(eligibleCases.length).toEqual(expectedCount);

    const manuallyAddedCase = eligibleCases.find(
      eligibleCase => eligibleCase.isManuallyAdded,
    );

    expect(manuallyAddedCase).toBeDefined();

    expect(test.getState('trialSession.status')).toEqual('Upcoming');
    expect(test.getState('trialSession.isCalendared')).toEqual(false);
  });
};
