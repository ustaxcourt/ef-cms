export default test => {
  return it('Petitions Clerk Views A Calendared Trial Session', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('trialSession.isCalendared')).toEqual(true);
    expect(test.getState('trialSession.caseOrder').length).toEqual(2);
  });
};
