export default test => {
  return it('Senior Attorney views dashboard to verify the work item that was forward by the docket clerk is now present', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardSeniorAttorney');
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    const workItem = test
      .getState('workQueue')
      .find(item => item.workItemId === test.stipulatedDecisionWorkItemId);

    expect(workItem).toBeDefined();
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;
    expect(workItem).toMatchObject({
      sentBy: 'respondent',
      assigneeName: 'Test Seniorattorney',
    });
    expect(workItem.messages).toMatchObject([
      {
        message:
          'a Stipulated Decision filed by respondent is ready for review',
      },
      {
        message: 'The work item was assigned.',
      },
      {
        message: 'hello world',
      },
    ]);
  });
};
