export default test => {
  return it('Respondent searches for a nonexistent case', async () => {
    await test.runSequence('updateSearchTermSequence', {
      searchTerm: '999-99',
    });
    await test.runSequence('submitCaseSearchSequence');
    expect(test.getState('currentPage')).toEqual('CaseSearchNoMatches');
  });
};
