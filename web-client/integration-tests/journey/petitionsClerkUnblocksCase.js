export default test => {
  return it('Petitions clerk unblocks the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').blocked).toBeTruthy();

    await test.runSequence('unblockCaseFromTrialSequence');

    expect(test.getState('alertSuccess').title).toEqual(
      'The block on this case has been removed',
    );
    expect(test.getState('caseDetail').blocked).toBeFalsy();
    expect(test.getState('caseDetail').blockedReason).toBeUndefined();

    // we need to wait for elasticsearch to get updated by the processing stream lambda
    await new Promise(resolve => setTimeout(resolve, 5000));

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: 'Jackson, Mississippi',
    });

    expect(test.getState('blockedCases')).toMatchObject([]);
  });
};
