export const practitionerSearchesForNonexistentCase = cerebralTest => {
  return it('Practitioner searches for nonexistent case', async () => {
    await cerebralTest.runSequence('updateSearchTermSequence', {
      searchTerm: '999-99',
    });
    await cerebralTest.runSequence('submitCaseSearchSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('CaseSearchNoMatches');
  });
};
