export const petitionerSearchesForCase = cerebralTest => {
  return it('Petitioner searches for case', async () => {
    await cerebralTest.runSequence('updateSearchTermSequence', {
      searchTerm: cerebralTest.docketNumber,
    });
    await cerebralTest.runSequence('submitCaseSearchSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
