export const practitionerSearchesForCase = cerebralTest => {
  return it('Practitioner searches for case', async () => {
    await cerebralTest.runSequence('updateSearchTermSequence', {
      searchTerm: cerebralTest.docketNumber,
    });
    await cerebralTest.runSequence('submitCaseSearchSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
