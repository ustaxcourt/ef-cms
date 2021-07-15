export const associatedUserViewsCaseDetailForSealedCase = cerebralTest => {
  return it('associated user views case detail for a sealed case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.sealedDate')).toBeDefined();
    expect(cerebralTest.getState('caseDetail.isSealed')).toBeTruthy();
    //this user should see all case details because they are associated with the case
    expect(cerebralTest.getState('caseDetail.caseCaption')).toBeDefined();
  });
};
