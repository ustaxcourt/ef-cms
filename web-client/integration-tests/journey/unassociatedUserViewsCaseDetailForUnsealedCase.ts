export const unassociatedUserViewsCaseDetailForUnsealedCase = cerebralTest => {
  return it('unassociated user views case detail for a unsealed case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.isSealed')).toEqual(false);
    expect(cerebralTest.getState('caseDetail.docketNumber')).toBeDefined();

    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.caseCaption')).toBeDefined();
    expect(
      cerebralTest.getState('caseDetail.docketEntries.length'),
    ).toBeGreaterThan(0);
  });
};
