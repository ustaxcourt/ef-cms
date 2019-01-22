export default test => {
  return it('Petitions clerk views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('workQueue').length).toBeGreaterThanOrEqual(0);
    expect(test.getState('sectionWorkQueue').length).toBeGreaterThan(0);
    expect(test.getState('users').length).toBeGreaterThan(0);
    expect(test.getState('workQueueToDisplay')).toEqual('individual');
    await test.runSequence('switchWorkQueueSequence', {
      workQueueToDisplay: 'section',
    });
    expect(test.getState('workQueueToDisplay')).toEqual('section');
    const workItem = test
      .getState('sectionWorkQueue')
      .find(workItem => workItem.docketNumber === test.docketNumber);
    expect(workItem).toBeDefined();
    expect(workItem.caseStatus).toEqual('new');
    expect(workItem.messages[0].message).toEqual(
      'A Petition filed by Petitioner is ready for review.',
    );
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;
  });
};
