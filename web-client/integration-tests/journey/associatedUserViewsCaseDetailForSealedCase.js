export const associatedUserViewsCaseDetailForSealedCase = test => {
  return it('associated user views case detail for a sealed case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.sealedDate')).toBeDefined();
    expect(test.getState('caseDetail.isSealed')).toBeTruthy();
    //this user should see all case details because they are associated with the case
    expect(test.getState('caseDetail.caseCaption')).toBeDefined();
  });
};
