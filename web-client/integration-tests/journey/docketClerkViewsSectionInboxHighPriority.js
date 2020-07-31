export const docketClerkViewsSectionInboxHighPriority = test => {
  return it('Docket clerk views section inbox with a high priority item', async () => {
    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const inboxQueue = test.getState('workQueue');
    const inProgressWorkItem = inboxQueue.find(
      workItem => workItem.docketNumber === test.docketNumber,
    );
    // the work item created is high priority and has a trial date
    expect(inProgressWorkItem.highPriority).toEqual(true);
    expect(inProgressWorkItem.trialDate).toBeDefined();
  });
};
