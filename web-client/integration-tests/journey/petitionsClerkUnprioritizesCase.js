export default test => {
  return it('Petitions clerk unprioritizes the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('caseDetail').blocked).toBeFalsy();

    await test.runSequence('unprioritizeCaseSequence');

    expect(test.getState('alertSuccess').title).toEqual(
      'The high priority on this case has been removed.',
    );
    expect(test.getState('caseDetail').highPriority).toBeFalsy();
    expect(test.getState('caseDetail').highPriorityReason).toBeUndefined();
  });
};
