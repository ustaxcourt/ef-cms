export const respondentSearchesForCase = cerebralTest => {
  return it('Respondent searches for case', async () => {
    await cerebralTest.runSequence('updateSearchTermSequence', {
      searchTerm: cerebralTest.docketNumber,
    });
    await cerebralTest.runSequence('submitCaseSearchSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
