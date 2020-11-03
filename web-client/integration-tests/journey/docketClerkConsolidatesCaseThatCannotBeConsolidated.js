export const docketClerkConsolidatesCaseThatCannotBeConsolidated = test => {
  return it('Docket clerk consolidates case that cannot be consolidated', async () => {
    test.setState('modal.confirmSelection', true);
    await test.runSequence('submitAddConsolidatedCaseSequence');

    expect(test.getState('modal.showModal')).toBe('AddConsolidatedCaseModal');
    expect(test.getState('modal.error')).toEqual([
      'Place of trial is not the same',
    ]);
    expect(test.getState('caseDetail.consolidatedCases')).toBeUndefined();
  });
};
