export default test => {
  return it('Senior Attorney views dashboard to verify the work item that was forward by the docket clerk is now present', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardSeniorAttorney');
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    const workItem = test
      .getState('workQueue')
      .find(item => item.workItemId === test.workItemId);

    expect(workItem).toBeDefined();
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;
    expect(workItem).toMatchObject({
      assigneeId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Seniorattorney',
    });
    expect(workItem.messages).toMatchObject([
      {
        message: 'Stipulated Decision filed by Respondent is ready for review.',
      },
      {
        message: 'Stipulated Decision filed by Respondent is ready for review.',
      },
      {
        message: 'hello world',
      },
    ]);
  });
};
