export const docketClerkViewsSectionInboxNotHighPriority = cerebralTest => {
  return it('Docket clerk views section inbox without a high priority item', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const inboxQueue = cerebralTest.getState('workQueue');
    const inProgressWorkItem = inboxQueue.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );
    // the work item should no longer be high priority after the case is removed from trial
    expect(inProgressWorkItem.highPriority).toEqual(false);
    expect(inProgressWorkItem.trialDate).toBeFalsy();
  });
};

export const docketClerkViewsSectionInbox = cerebralTest => {
  return it('Docket clerk views section inbox without a high priority item', async () => {
    // 1. check for the existence of the recently added consolidated cases
    // 2. check for the existence of the recently added consolidated cases

    // AFTER COUNT OF THE INBOX QUEUE

    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const inboxQueue = cerebralTest.getState('workQueue');
    console.log('inboxQueue', inboxQueue.length);
    const consolidatedGroupItems = inboxQueue.filter(
      item => item.inConsolidatedGroup,
    );
    const leadCaseItems = inboxQueue.filter(item => item.inLeadCase);
    console.log('consolidatedGroupItems', consolidatedGroupItems);
    console.log('leadCaseItems', leadCaseItems);

    // const inProgressWorkItem = inboxQueue.find(
    //   workItem => workItem.docketNumber === cerebralTest.docketNumber,
    // );

    //

    // await cerebralTest.runSequence('gotoWorkQueueSequence');
    // expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    // await cerebralTest.runSequence('chooseWorkQueueSequence', {
    //   box: 'inbox',
    //   queue: 'section',
    // });

    // const inboxQueue = cerebralTest.getState('workQueue');
    // const inProgressWorkItem = inboxQueue.find(
    //   workItem => workItem.docketNumber === cerebralTest.docketNumber,
    // );
    // // the work item should no longer be high priority after the case is removed from trial
    // expect(inProgressWorkItem.highPriority).toEqual(false);
    // expect(inProgressWorkItem.trialDate).toBeFalsy();
  });
};

// const docketClerkNavigatesToSectionWorkQueueInbox = async (
//   cerebralTest,
//   isLeadCase,
// ) => {
//   await cerebralTest.runSequence('gotoWorkQueueSequence');
//   expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
//   await cerebralTest.runSequence('chooseWorkQueueSequence', {
//     box: 'inbox',
//     queue: 'section',
//   });

//   const inboxQueue = cerebralTest.getState('workQueue');

//   const leadCaseWorkItem = inboxQueue.find(
//     workItem => workItem.docketNumber === cerebralTest.leadDocketNumber,
//   );

//   const nonLeadCase = inboxQueue.find(
//     workItem => workItem.docketNumber === cerebralTest.docketNumber,
//   );

//   return isLeadCase ? leadCaseWorkItem : nonLeadCase;

//   // const inboxQueue = cerebralTest.getState('workQueue');
// };
