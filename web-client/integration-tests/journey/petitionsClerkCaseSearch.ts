export const petitionsClerkCaseSearch = cerebralTest => {
  return it('Petitions clerk searches for case', async () => {
    cerebralTest.setState('caseDetail', {});
    await cerebralTest.runSequence('updateSearchTermSequence', {
      searchTerm: cerebralTest.docketNumber,
    });
    await cerebralTest.runSequence('submitCaseSearchSequence');
    expect(cerebralTest.getState('caseDetail.docketNumber')).toEqual(
      cerebralTest.docketNumber,
    );
  });
};
