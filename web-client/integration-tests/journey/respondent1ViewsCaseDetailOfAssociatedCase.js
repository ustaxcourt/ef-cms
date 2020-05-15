export const respondent1ViewsCaseDetailOfAssociatedCase = test => {
  return it('Respondent1 views case detail of associated case', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('caseDetail.irsPractitioners.1.name')).toEqual(
      'Test IRS Practitioner1',
    );
  });
};
