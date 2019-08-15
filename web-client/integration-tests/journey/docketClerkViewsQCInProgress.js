export default test => {
  return it('Docket clerk views My Document QC - In Progress', async () => {
    await test.runSequence('gotoDashboardSequence');
    expect(test.getState('currentPage')).toEqual('DashboardDocketClerk');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'my',
      workQueueIsInternal: true,
    });
    let myOutboxWorkQueue = test.getState('workQueue');
    let stipulatedDecisionWorkItem = myOutboxWorkQueue.find(
      workItem => workItem.documentId === test.docketRecordEntry.documentId,
    );
    expect(stipulatedDecisionWorkItem.length).toBeGreaterThan(0);
  });
};
