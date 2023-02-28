export const unauthedUserViewsCaseDetailForSealedCase = cerebralTest => {
  return it('View case detail for a sealed case', async () => {
    await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PublicCaseDetail');

    expect(cerebralTest.getState('caseDetail.isSealed')).toEqual(true);
    expect(cerebralTest.getState('caseDetail.docketNumber')).toBeDefined();

    //this user should NOT see any case details because they are not associated with the case
    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.caseCaption')).toBeUndefined();
    expect(cerebralTest.getState('caseDetail.docketEntries')).toEqual([]);
  });
};
