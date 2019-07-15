export default test => {
  return it('Respondent1 views case detail of associated case', async () => {
    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetail');
    expect(test.getState('caseDetail.respondents.1.name')).toEqual(
      'Test Respondent1',
    );
  });
};
