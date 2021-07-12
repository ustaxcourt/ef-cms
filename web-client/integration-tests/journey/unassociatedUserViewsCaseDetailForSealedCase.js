export const unassociatedUserViewsCaseDetailForSealedCase = cerebralTest => {
  return it('unassociated user views case detail for a sealed case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.isSealed')).toBeTruthy();
    expect(cerebralTest.getState('caseDetail.docketNumber')).toBeDefined();

    //this user should NOT see any case details because they are not associated with the case
    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.caseCaption')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.docketEntries')).toEqual([]);
  });
};
