export default test => {
  return it('Petitions clerk blocks the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').blocked).toBeFalsy();

    await test.runSequence('blockCaseFromTrialSequence');

    expect(test.getState('validationErrors')).toEqual({
      reason: 'Provide a reason',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'reason',
      value: 'just because',
    });

    await test.runSequence('blockCaseFromTrialSequence');

    expect(test.getState('alertSuccess').title).toEqual(
      'This case is now blocked from being set for trial',
    );
    expect(test.getState('caseDetail').blocked).toBeTruthy();
    expect(test.getState('caseDetail').blockedReason).toEqual('just because');

    // we need to wait for elasticsearch to get updated by the processing stream lambda
    await new Promise(resolve => setTimeout(resolve, 3000));

    await test.runSequence('gotoBlockedCasesReportSequence');

    await test.runSequence('getBlockedCasesByTrialLocationSequence', {
      key: 'trialLocation',
      value: 'Jackson, Mississippi',
    });

    expect(test.getState('blockedCases')).toMatchObject([
      {
        blocked: true,
        blockedReason: 'just because',
        caseCaption:
          'Test Person, Deceased, Test Person, Surviving Spouse, Petitioner',
        docketNumber: test.docketNumber,
        docketNumberSuffix: 'S',
        status: 'New',
      },
    ]);
  });
};
