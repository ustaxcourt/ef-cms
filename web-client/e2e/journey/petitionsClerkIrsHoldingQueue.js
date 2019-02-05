import { runCompute } from 'cerebral/test';

import caseDetailHelper from '../../src/presenter/computeds/caseDetailHelper';
import documentDetailHelper from '../../src/presenter/computeds/documentDetailHelper';

export default test => {
  return it('Petitions clerk views IRS Holding Queue', async () => {
    // go to the petitions section work queue
    await test.runSequence('gotoDashboardSequence'); //runs getWorkItemsForSection then set
    //verify that individuals workitems for the inbox are in state

    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });

    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'my',
    });
    // expect(test.getState('workQueue').length).toBeGreaterThan(0);

    //click on Sent/Outbox tab for the section
    await test.runSequence('chooseWorkQueueSequence', {
      //switched from inbox to outbox
      box: 'outbox',
      queue: 'section',
      // })
      // .then(r => {
      //   console.log('wow man');
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
    const docketNumber = test.getState('workQueue.0.docketNumber');
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.getState('workQueue.0.document.documentId'),
    });

    const caseDetailHelperBatched = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    const documentDetailHelperBatched = runCompute(documentDetailHelper, {
      state: test.getState(),
    });
    expect(documentDetailHelperBatched.showCaseDetailsView).toEqual(true);
    expect(documentDetailHelperBatched.showCaseDetailsEdit).toEqual(false);
    expect(caseDetailHelperBatched.showServeToIrsButton).toEqual(false);
    expect(caseDetailHelperBatched.showRecallButton).toEqual(true);

    // await test.runSequence('clickRecallPetitionSequence');
    // expect(test.getState('showModal')).toEqual('RecallModalDialog');
    // await test.runSequence('dismissModalSequence');
    // expect(test.getState('showModal')).toEqual('');
    // // recall the petition
    // await test.runSequence('clickRecallPetitionSequence');
    await test.runSequence('submitRecallPetitionFromIRSHoldingQueueSequence');
    // back on the dashboard
    // console.log('--------------');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'outbox',
      queue: 'section',
    });
    // console.log('--------------');
    //switch to my in box
    // console.log('switching to my inbox');
    //the following does not wait!

    const generatePromise = (millis, value) => {
      return new Promise(resolve => {
        setTimeout(() => resolve(value), millis);
      });
    };

    await test
      .runSequence('chooseWorkQueueSequence', {
        box: 'inbox',
        queue: 'section',
      })
      .then(() => {
        console.log('then1');
        expect(test.getState('workQueueToDisplay')).toEqual({
          box: 'inbox',
          queue: 'section',
        });
      });

    // await test.runSequence('getTrialCitiesSequence');

    console.log(
      'workQueue for section inbox',
      test.getState('workQueue').length,
    );

    console.log('---again-------');
    //
    await test
      .runSequence('chooseWorkQueueSequence', {
        //switched from inbox to outbox
        queue: 'section',
        box: 'inbox',
      })
      .then(() => {
        console.log('then2');
        expect(test.getState('workQueueToDisplay')).toEqual({
          box: 'inbox',
          queue: 'section',
        });
      });

    await generatePromise(3000, true);

    // expect(test.getState('workQueue.0.caseStatus')).toEqual('Recalled');
    // expect(test.getState('workQueue.0.messages.0')).toEqual(
    //   'Assigned to Petitions Clerk',
    // );
    // // goto the first work item in the my queue inbox, the one we just recalled
    // await test.runSequence('gotoDocumentDetailSequence', {
    //   docketNumber: test.docketNumber,
    //   documentId: test.getState('workQueue.0.document.documentId'),
    // });
    //
    // const caseDetailHelperRecalled = runCompute(caseDetailHelper, {
    //   state: test.getState(),
    // });
    // const documentDetailHelperRecalled = runCompute(documentDetailHelper, {
    //   state: test.getState(),
    // });
    // expect(documentDetailHelperRecalled.showCaseDetailsView).toEqual(false);
    // expect(caseDetailHelperRecalled.showCaseDetailsEdit).toEqual(true);
    // expect(caseDetailHelperRecalled.showServeToIrsButton).toEqual(true);
    // expect(caseDetailHelperRecalled.showRecallButton).toEqual(false);

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
    // expect(test.getState('caseDetail.status')).toEqual('Batched for IRS');
  });
};
