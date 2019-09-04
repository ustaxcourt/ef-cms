export default test => {
  return it('Practitioner searches for nonexistent case', async () => {
    await test.runSequence('updateSearchTermSequence', {
      searchTerm: '999-99',
    });
    await test.runSequence('submitCaseSearchSequence');
    expect(test.getState('currentPage')).toEqual('CaseSearchNoMatches');
  });
};
