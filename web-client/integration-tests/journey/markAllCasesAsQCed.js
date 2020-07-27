export const markAllCasesAsQCed = (test, getDocketNumbers) => {
  return it('Marks all the eligible cases as QCed', async () => {
    const docketNumbers = getDocketNumbers();

    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    for (const docketNumber of docketNumbers) {
      await test.runSequence('updateQcCompleteForTrialSequence', {
        docketNumber,
        qcCompleteForTrial: true,
      });
    }
  });
};
