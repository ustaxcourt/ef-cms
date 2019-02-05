import { runCompute } from 'cerebral/test';

import caseDetailHelper from '../../src/presenter/computeds/caseDetailHelper';

export default test => {
  return it('Petitions clerk views IRS Holding Queue', async () => {
    // go to the petitions section work queue
    await test.runSequence('gotoDashboardSequence'); //runs getWorkItemsForSection then set
    //verify that individuals workitems for the inbox are in state

    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');

    await test.runSequence('chooseWorkQueueSequence', {
      queue: 'section',
      box: 'inbox',
    });

    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'section',
    });
    expect(test.getState('workQueue').length).toBeGreaterThan(0);

    //click on Sent/Outbox tab for the section
    await test.runSequence('chooseWorkQueueSequence', {
      //switched from inbox to outbox
      queue: 'section',
      box: 'outbox',
    });
    //verify Sent tab is shown
    //verify that the recalled and general

    //verify that the section workitems are in state

    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'outbox',
      queue: 'section',
    });

    // TODO: verify that nothing in the outbox is over 7 days old, we'll need over a week of seed data for this
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    // the first item in the outbox should be the Petition batched for IRS from the previous test
    expect(test.getState('workQueue.0.caseStatus')).toEqual('Batched for IRS');
    // goto the first work item in the section queue outbox, the one we just batched for IRS
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.getState('workQueue.0.document.documentId'),
    });
    const helperBatched = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    // expect(helperBatched.showCaseDetailsView).toEqual(true); //doesn't exist?
    // expect(helperBatched.showCaseDetailsEdit).toEqual(false);
    expect(helperBatched.showServeToIrsButton).toEqual(false);
    expect(helperBatched.showRecallButton).toEqual(true);

    // await test.runSequence('clickRecallPetitionSequence');
    // expect(test.getState('showModal')).toEqual('RecallModalDialog');
    // await test.runSequence('dismissModalSequence');
    // expect(test.getState('showModal')).toEqual('');
    // // recall the petition
    // await test.runSequence('clickRecallPetitionSequence');
    await test.runSequence('submitRecallPetitionFromIRSHoldingQueueSequence');
    // back on the dashboard
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'outbox',
      queue: 'section',
    });
    //switch to sent box
    // await test.runSequence('chooseWorkQueueSequence', {
    //   //switched from inbox to outbox
    //   queue: 'my',
    //   box: 'outbox',
    // });
    // expect(test.getState('workQueueToDisplay')).toEqual({
    //   box: 'outbox',
    //   queue: 'my',
    // });
    // //
    // await test.runSequence('chooseWorkQueueSequence', {
    //   //switched from inbox to outbox
    //   queue: 'section',
    //   box: 'inbox',
    // });
    //
    // expect(test.getState('workQueueToDisplay')).toEqual({
    //   box: 'inbox',
    //   queue: 'section',
    // });

    // expect(test.getState('workQueue.0.status')).toEqual('Recalled');
    // expect(test.getState('workQueue.my.inbox.0.messages.0')).toEqual(
    //   'Assigned to Petitions Clerk',
    // );
    // // goto the first work item in the my queue inbox, the one we just recalled
    // await test.runSequence('gotoDocumentDetailSequence', {
    //   docketNumber: test.docketNumber,
    //   documentId: test.getState('workQueue.my.inbox.0.document.documentId'),
    // });
    // const helperRecalled = runCompute(caseDetailHelper, {
    //   state: test.getState(),
    // });
    // expect(helperRecalled.showCaseDetailsView).toEqual(false);
    // expect(helperRecalled.showCaseDetailsEdit).toEqual(true);
    // expect(helperRecalled.showServeToIrsButton).toEqual(true);
    // expect(helperRecalled.showRecallButton).toEqual(false);
    // // assign to another petitionsclerk
    // const workItem = test.getState('workQueue.my.inbox.0');
    // await test.runSequence('selectWorkItemSequence', {
    //   workItem: workItem,
    // });
    // await test.runSequence('selectAssigneeSequence', {
    //   assigneeId: 'petitionsclerkXX',
    //   assigneeName: 'Test Petitionsclerk XX',
    // });
    // await test.runSequence('assignSelectedWorkItemsSequence');
    // // no longer in our inbox!
    // expect(test.getState('workQueue.my.inbox.0.docketNumber')).not.toBe(
    //   test.docketNumber,
    // );

    // await test.runSequence('submitPetitionToIRSHoldingQueueSequence'); // ??
  });
};
