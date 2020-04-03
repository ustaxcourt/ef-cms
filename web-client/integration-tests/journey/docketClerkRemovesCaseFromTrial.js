export const docketClerkRemovesCaseFromTrial = test => {
  return it('Docket clerk removes case from trial session', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openRemoveFromTrialSessionModalSequence');
    await test.runSequence('updateModalValueSequence', {
      key: 'disposition',
      value: 'Test disposition',
    });

    await test.runSequence('removeCaseFromTrialSequence');
  });
};
