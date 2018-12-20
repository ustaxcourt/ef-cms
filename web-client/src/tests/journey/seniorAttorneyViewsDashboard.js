export default test => {
  return it('Senior Attorney views dashboard to verify the work item that was forward by the docket clerk is now present', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardSeniorAttorney');
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.workItemId === test.workItemId);
    expect(workItem).toBeDefined();
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;
    expect(workItem).toMatchObject({
      sentBy: 'respondent',
      assigneeName: 'Test Seniorattorney',
    });
  });
};
