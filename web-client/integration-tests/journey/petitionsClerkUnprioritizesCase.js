export const petitionsClerkUnprioritizesCase = cerebralTest => {
  return it('Petitions clerk unprioritizes the case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('caseDetail').highPriority).toBeTruthy();

    await cerebralTest.runSequence('unprioritizeCaseSequence');

    expect(cerebralTest.getState('alertSuccess').message).toEqual(
      'High priority removed. Case is eligible for next available trial session.',
    );
    expect(cerebralTest.getState('caseDetail').highPriority).toBeFalsy();
    expect(
      cerebralTest.getState('caseDetail').highPriorityReason,
    ).toBeUndefined();
  });
};
