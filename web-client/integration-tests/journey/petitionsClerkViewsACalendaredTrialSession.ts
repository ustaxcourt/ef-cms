export const petitionsClerkViewsACalendaredTrialSession = (
  cerebralTest,
  expectedCount,
) => {
  return it('Petitions Clerk Views A Calendared Trial Session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(true);
    expect(cerebralTest.getState('trialSession.caseOrder').length).toEqual(
      expectedCount,
    );
  });
};
