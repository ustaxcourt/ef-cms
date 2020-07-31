export const docketClerkViewsSectionInboxNotHighPriority = test => {
  return it('Docket clerk views section inbox without a high priority item', async () => {
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
    // the work item should no longer be high priority after the case is removed from trial
    expect(inProgressWorkItem.highPriority).toEqual(false);
    expect(inProgressWorkItem.trialDate).toBeFalsy();
  });
};
