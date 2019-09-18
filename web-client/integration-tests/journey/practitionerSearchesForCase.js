export default test => {
  return it('Practitioner searches for case', async () => {
    await test.runSequence('updateSearchTermSequence', {
      searchTerm: test.docketNumber,
    });
    await test.runSequence('submitCaseSearchSequence');
    expect(test.getState('currentPage')).toEqual('CaseDetail');
  });
};
