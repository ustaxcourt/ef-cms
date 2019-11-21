export default test => {
  return it('Petitions clerk manually removes a case from an uncalendared trial session', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.manuallyAddedTrialCaseDocketNumber,
    });

    await test.runSequence('openRemoveFromTrialSessionModalSequence');
    await test.runSequence('updateModalValueSequence', {
      key: 'disposition',
      value: 'Test disposition',
    });

    await test.runSequence('removeCaseFromTrialSequence');
  });
};
