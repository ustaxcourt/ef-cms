export const petitionsClerkManuallyRemovesCaseFromTrial = cerebralTest => {
  return it('Petitions clerk manually removes a case from an uncalendared trial session', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.manuallyAddedTrialCaseDocketNumber,
    });

    await cerebralTest.runSequence('openRemoveFromTrialSessionModalSequence');
    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'disposition',
      value: 'Test disposition',
    });

    await cerebralTest.runSequence('removeCaseFromTrialSequence');
  });
};
