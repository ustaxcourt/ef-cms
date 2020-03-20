export const docketClerkSealsCase = test => {
  return it('Docketclerk seals a case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('caseDetail.sealedDate')).toBeUndefined();

    await test.runSequence('sealCaseSequence');

    expect(test.getState('caseDetail.sealedDate')).toBeDefined();
    expect(test.getState('caseDetail.isSealed')).toBeTruthy();
  });
};
