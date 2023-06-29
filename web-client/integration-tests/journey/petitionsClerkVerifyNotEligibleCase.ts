export const petitionsClerkVerifyNotEligibleCase = cerebralTest => {
  return it('Petitions clerk verifies the created case does NOT exist on the "Lubbock, Texas" trial session eligible list', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: 'a1b04943-8ea8-422b-8990-dec3ca644c83',
    });

    expect(
      cerebralTest
        .getState('trialSession.eligibleCases')
        .find(
          eligibleCase =>
            eligibleCase.docketNumber === cerebralTest.docketNumber,
        ),
    ).not.toBeDefined();
  });
};
