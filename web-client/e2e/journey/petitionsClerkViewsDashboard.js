export default test => {
  return it('Petitions clerk views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('workQueue').length).toBeGreaterThanOrEqual(0);
    expect(test.getState('users').length).toBeGreaterThan(0);
    await test.runSequence('chooseWorkQueueSequence', {
      queue: 'section',
      box: 'inbox',
    });
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.docketNumber === test.docketNumber);
    expect(workItem).toBeDefined();
    expect(workItem.caseStatus).toEqual('New');
    expect(workItem.messages[0].message).toEqual(
      'A Petition filed by Petitioner is ready for review.',
    );
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;
  });
};
