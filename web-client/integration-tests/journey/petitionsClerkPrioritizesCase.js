export default test => {
  return it('Petitions clerk prioritizes the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').highPriority).toBeFalsy();

    await test.runSequence('prioritizeCaseSequence');

    expect(test.getState('validationErrors')).toEqual({
      reason: 'Provide a reason',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'reason',
      value: 'just because',
    });

    await test.runSequence('prioritizeCaseSequence');

    expect(test.getState('alertSuccess').title).toEqual(
      'This case has been added to eligible cases.',
    );
    expect(test.getState('caseDetail').highPriority).toBeTruthy();
    expect(test.getState('caseDetail').highPriorityReason).toEqual(
      'just because',
    );
  });
};
