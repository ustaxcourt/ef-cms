export default test => {
  return it('Petitions clerk blocks the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').blocked).toBeFalsy();

    await test.runSequence('blockFromTrialSequence');

    expect(test.getState('validationErrors')).toEqual({
      reason: 'Provide a reason',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'reason',
      value: 'just because',
    });

    await test.runSequence('blockFromTrialSequence');

    expect(test.getState('alertSuccess').title).toEqual(
      'This case is now blocked from being set for trial',
    );
    expect(test.getState('caseDetail').blocked).toBeTruthy();
    expect(test.getState('caseDetail').blockedReason).toEqual('just because');
  });
};
