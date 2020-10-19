export const practitionerViewsCaseDetail = (test, isAssociated = true) => {
  return it('Practitioner views case detail', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetail');
    if (isAssociated) {
      expect(test.getState('caseDetail.privatePractitioners')).toEqual([]);
    }
  });
};
