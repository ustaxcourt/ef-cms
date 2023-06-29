export const petitionsClerkPrioritizesCase = cerebralTest => {
  return it('Petitions clerk prioritizes the case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail').highPriority).toBeFalsy();

    await cerebralTest.runSequence('prioritizeCaseSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      reason: 'Provide a reason',
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'reason',
      value: 'just because',
    });

    await cerebralTest.runSequence('prioritizeCaseSequence');

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'Case added to eligible list and will be set for trial when calendar is set.',
    );
    expect(cerebralTest.getState('caseDetail').highPriority).toBeTruthy();
    expect(cerebralTest.getState('caseDetail').highPriorityReason).toEqual(
      'just because',
    );
  });
};
