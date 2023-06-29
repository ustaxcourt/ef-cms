export const respondentSearchesForNonexistentCase = cerebralTest => {
  return it('Respondent searches for a nonexistent case', async () => {
    await cerebralTest.runSequence('updateSearchTermSequence', {
      searchTerm: '999-99',
    });
    await cerebralTest.runSequence('submitCaseSearchSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('CaseSearchNoMatches');
  });
};
