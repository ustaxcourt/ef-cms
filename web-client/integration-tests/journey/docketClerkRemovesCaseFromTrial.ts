export const docketClerkRemovesCaseFromTrial = cerebralTest => {
  return it('Docket clerk removes case from trial session', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openRemoveFromTrialSessionModalSequence');
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'disposition',
      value: 'Test disposition',
    });

    await cerebralTest.runSequence('removeCaseFromTrialSequence');
  });
};
