export const docketClerkSearchesForCaseToConsolidateWith = test => {
  return it('Docket clerk searches for case to consolidate with', async () => {
    test.setState('modal.searchTerm', test.leadDocketNumber);
    await test.runSequence('submitCaseSearchForConsolidationSequence', {
      docketNumber: test.leadDocketNumber,
    });
    expect(test.getState('modal.caseDetail.docketNumber')).toEqual(
      test.leadDocketNumber,
    );
  });
};
