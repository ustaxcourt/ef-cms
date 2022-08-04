import {
  getFormattedDocumentQCSectionInbox,
  getSectionInboxCount,
  refreshElasticsearchIndex,
} from '../helpers';

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

// const getInboxQueue = async cerebralTest => {
//   await cerebralTest.runSequence('gotoWorkQueueSequence');
//   expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
//   await cerebralTest.runSequence('chooseWorkQueueSequence', {
//     box: 'inbox',
//     queue: 'section',
//   });
//   return cerebralTest.getState('workQueue');
// };

export const docketClerkViewsSectionInbox = cerebralTest => {
  // return it('Docket clerk views section inbox without a high priority item', async () => {
  //   // 1. check for the existence of the recently added consolidated cases
  //   // 2. check for the existence of the recently added consolidated cases

  //   // AFTER COUNT OF THE INBOX QUEUE

  //   await cerebralTest.runSequence('gotoWorkQueueSequence');
  //   expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
  //   await cerebralTest.runSequence('chooseWorkQueueSequence', {
  //     box: 'inbox',
  //     queue: 'section',
  //   });

  //   const inboxQueue = cerebralTest.getState('workQueue');
  //   console.log('inboxQueue', inboxQueue.length);

  //   console.log('cerebralTest.docketNumber', cerebralTest.docketNumber);
  //   const consolidatedGroupItems = inboxQueue.filter(
  //     item => item.docketNumber === cerebralTest.docketNumber,
  //   );
  //   console.log('consolidatedGroupItems', consolidatedGroupItems);

  //   // const inProgressWorkItem = inboxQueue.find(
  //   //   workItem => workItem.docketNumber === cerebralTest.docketNumber,
  //   // );

  //   //

  //   // await cerebralTest.runSequence('gotoWorkQueueSequence');
  //   // expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
  //   // await cerebralTest.runSequence('chooseWorkQueueSequence', {
  //   //   box: 'inbox',
  //   //   queue: 'section',
  //   // });

  //   // const inboxQueue = cerebralTest.getState('workQueue');
  //   // const inProgressWorkItem = inboxQueue.find(
  //   //   workItem => workItem.docketNumber === cerebralTest.docketNumber,
  //   // );
  //   // // the work item should no longer be high priority after the case is removed from trial
  //   // expect(inProgressWorkItem.highPriority).toEqual(false);
  //   // expect(inProgressWorkItem.trialDate).toBeFalsy();
  // });
  return it('login as the docketclerk and verify there are 4 document qc section inbox entries', async () => {
    await refreshElasticsearchIndex();
    // const qcSectionInboxCountBefore = getSectionInboxCount(cerebralTest);

    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      cerebralTest,
    );

    console.log('documentQCSectionInbox', documentQCSectionInbox.length);
    console.log('cerebralTest.docketNumber', cerebralTest.docketNumber);

    // const decisionWorkItem = documentQCSectionInbox.find(
    //   workItem => workItem.docketNumber === cerebralTest.docketNumber,
    // );
    // expect(decisionWorkItem).toMatchObject({
    //   docketEntry: {
    //     documentTitle: 'Agreed Computation for Entry of Decision',
    //     userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    //   },
    // });

    // const qcSectionInboxCountAfter = getSectionInboxCount(cerebralTest);
    // expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 4);
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
