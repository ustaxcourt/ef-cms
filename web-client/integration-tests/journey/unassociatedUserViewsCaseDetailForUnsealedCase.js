export const unassociatedUserViewsCaseDetailForUnsealedCase = cerebralTest => {
  return it('unassociated user views case detail for a unsealed case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    // TESTS CHECKING FOR isSealed being true but sealedDate being undefined

    expect(cerebralTest.getState('caseDetail.isSealed')).toBeFalsy();
    expect(cerebralTest.getState('caseDetail.docketNumber')).toBeDefined();

    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.caseCaption')).toBeDefined();
    expect(
      cerebralTest.getState('caseDetail.docketEntries.length'),
    ).toBeGreaterThan(0);
  });
};
