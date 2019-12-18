export default test => {
  return it('Docket clerk sets the calendar for a trial session', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    await test.runSequence('setTrialSessionCalendarSequence');
  });
};
