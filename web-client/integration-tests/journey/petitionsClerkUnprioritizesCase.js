export const petitionsClerkUnprioritizesCase = test => {
  return it('Petitions clerk unprioritizes the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').highPriority).toBeTruthy();

    await test.runSequence('unprioritizeCaseSequence');

    expect(test.getState('alertSuccess').message).toEqual(
      'High priority removed. Case is eligible for next available trial session.',
    );
    expect(test.getState('caseDetail').highPriority).toBeFalsy();
    expect(test.getState('caseDetail').highPriorityReason).toBeUndefined();
  });
};
