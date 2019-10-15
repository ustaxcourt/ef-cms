export default test => {
  return it('Petitions clerk unblocks the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').blocked).toBeTruthy();

    await test.runSequence('unblockFromTrialSequence');

    expect(test.getState('alertSuccess').title).toEqual(
      'The block on this case has been removed',
    );
    expect(test.getState('caseDetail').blocked).toBeFalsy();
    expect(test.getState('caseDetail').blockedReason).toBeUndefined();
  });
};
