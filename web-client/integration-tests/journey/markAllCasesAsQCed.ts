export const markAllCasesAsQCed = (cerebralTest, getDocketNumbers) => {
  return it('Marks all the eligible cases as QCed', async () => {
    const docketNumbers = getDocketNumbers();

    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    for (const docketNumber of docketNumbers) {
      await cerebralTest.runSequence('updateQcCompleteForTrialSequence', {
        docketNumber,
        qcCompleteForTrial: true,
      });
    }
  });
};
