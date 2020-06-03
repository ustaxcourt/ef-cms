export const respondentViewsCaseDetailOfUnassociatedCase = test => {
  return it('Respondent views case detail of unassociated case', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('caseDetail.irsPractitioners.length')).toEqual(1);
  });
};
