export const irsSuperuserSearchForCase = cerebralTest => {
  return it('irsSuperuser searches for case by docket number from dashboard', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');
    cerebralTest.setState('header.searchTerm', cerebralTest.docketNumber);
    await cerebralTest.runSequence('submitCaseSearchSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetail');
  });
};
