export const practitionerViewsCaseDetailOfOwnedCase = test => {
  return it('Practitioner views case detail of owned case', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('caseDetail.privatePractitioners.0.name')).toEqual(
      'Test Private Practitioner',
    );
    expect(
      test.getState('caseDetail.privatePractitioners.0.representingPrimary'),
    ).toEqual(true);
    expect(
      test.getState('caseDetail.privatePractitioners.0.representingSecondary'),
    ).toEqual(true);
  });
};
