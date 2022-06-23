export const manuallyAddCaseToTrial = (cerebralTest, index = '') => {
  return it('manually add a case to a trial session', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest[`docketNumber${index}`],
    });

    await cerebralTest.runSequence('openAddToTrialModalSequence');

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'showAllLocations',
      value: true,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: cerebralTest.trialSessionId,
    });

    await cerebralTest.runSequence('addCaseToTrialSessionSequence');
  });
};
