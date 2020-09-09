export const unassociatedUserViewsCaseDetailForSealedCase = test => {
  return it('unassociated user views case detail for a sealed case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.isSealed')).toBeTruthy();
    expect(test.getState('caseDetail.docketNumber')).toBeDefined();

    //this user should NOT see any case details because they are not associated with the case
    expect(test.getState('caseDetail.sealedDate')).toBeUndefined();
    expect(test.getState('caseDetail.caseCaption')).toBeUndefined();
    expect(test.getState('caseDetail.docketEntries')).toEqual([]);
  });
};
