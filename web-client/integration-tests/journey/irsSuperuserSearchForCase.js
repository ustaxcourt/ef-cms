export const irsSuperuserSearchForCase = test => {
  return it('irsSuperuser searches for case by docket number from dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    test.setState('header.searchTerm', test.docketNumber);
    await test.runSequence('submitCaseSearchSequence');
    expect(test.getState('currentPage')).toEqual('CaseDetail');
  });
};
