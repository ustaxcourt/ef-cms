export const markAllCasesAsQCed = (test, getCaseIds) => {
  return it('Marks all the eligible cases as QCed', async () => {
    const caseIds = getCaseIds();

    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    for (const caseId of caseIds) {
      await test.runSequence('updateQcCompleteForTrialSequence', {
        caseId,
        qcCompleteForTrial: true,
      });
    }
  });
};
