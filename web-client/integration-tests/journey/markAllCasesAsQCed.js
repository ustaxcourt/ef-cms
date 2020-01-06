export default (test, cases) => {
  return it('Marks all the eligible cases as QCed', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    for (const unQCedCase of cases) {
      await test.runSequence('updateQcCompleteForTrialSequence', {
        caseId: unQCedCase.caseId,
        qcCompleteForTrial: true,
      });
    }
  });
};
