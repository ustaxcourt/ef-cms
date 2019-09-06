export default test => {
  return it('Respondent searches for case', async () => {
    await test.runSequence('updateSearchTermSequence', {
      searchTerm: test.docketNumber,
    });
    await test.runSequence('submitCaseSearchSequence');
    expect(test.getState('currentPage')).toEqual('CaseDetail');
  });
};
