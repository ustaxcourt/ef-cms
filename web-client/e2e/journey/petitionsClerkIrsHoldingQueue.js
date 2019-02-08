import { runCompute } from 'cerebral/test';

import caseDetailHelper from '../../src/presenter/computeds/caseDetailHelper';
import documentDetailHelper from '../../src/presenter/computeds/documentDetailHelper';

const generatePromise = (millis, value) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), millis);
  });
};

export default test => {
  return it('Petitions clerk views IRS Holding Queue', async () => {
    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');

    await test.runSequence('chooseWorkQueueSequence', {
      queue: 'my',
      box: 'inbox',
    });

    expect(test.getState('workQueueToDisplay')).toEqual({
      queue: 'my',
      box: 'inbox',
    });

    await test.runSequence('chooseWorkQueueSequence', {
      queue: 'section',
      box: 'outbox',
    });

    // verify item in general status older than 7 days does not show
    expect(
      test.getState('workQueue').find(item => {
        return item.isInitializeCreate && item.docketNumber === '199-18';
      }),
    ).toBeUndefined();

    // verify that the section workitems are in state
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    // the first item in the outbox should be the Petition batched for IRS from the previous test
    expect(test.getState('workQueue.0.caseStatus')).toEqual('Batched for IRS');
    // goto the first work item in the section queue outbox, the one we just batched for IRS
    const docketNumber = test.getState('workQueue.0.docketNumber');
    const documentId = test.getState('workQueue.0.document.documentId');
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber,
      documentId,
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

    await test.runSequence('submitRecallPetitionFromIRSHoldingQueueSequence');
    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');
    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'outbox',
      queue: 'section',
    });

    await test.runSequence('chooseWorkQueueSequence', {
      queue: 'section',
      box: 'inbox',
    });

    expect(test.getState('workQueueToDisplay')).toEqual({
      queue: 'section',
      box: 'inbox',
    });

    await generatePromise(1000, true); // TODO: remove sleep statements

    expect(test.getState('workQueue.0.caseStatus')).toEqual('Recalled');

    const foundMessage = test.getState('workQueue.0.messages').find(message => {
      return message.message === 'Petition recalled from IRS Holding Queue';
    });
    expect(foundMessage.message).toEqual(
      'Petition recalled from IRS Holding Queue',
    );
    // goto the first work item in the my queue inbox, the one we just recalled
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber,
      documentId,
    });

    expect(test.getState('caseDetail.docketNumber')).toEqual(docketNumber);
    expect(test.getState('workQueue.0.caseStatus')).toEqual('Recalled');
    expect(test.getState('caseDetail.status')).toEqual('Recalled');

    const caseDetailHelperRecalled = runCompute(caseDetailHelper, {
      state: test.getState(),
    });
    const documentDetailHelperRecalled = runCompute(documentDetailHelper, {
      state: test.getState(),
    });

    expect(documentDetailHelperRecalled.showCaseDetailsView).toEqual(false);
    expect(documentDetailHelperRecalled.showCaseDetailsEdit).toEqual(true);
    expect(caseDetailHelperRecalled.showServeToIrsButton).toEqual(true);
    expect(caseDetailHelperRecalled.showRecallButton).toEqual(false);

    // assign to another petitionsclerk
    const workItem = test.getState('workQueue').find(item => {
      return item.isInitializeCase && item.docketNumber === docketNumber;
    });

    expect(workItem.showComplete).toBeFalsy();
    expect(workItem.showSendTo).toBeFalsy();

    await test.runSequence('selectWorkItemSequence', {
      workItem: workItem,
    });

    await test.runSequence('selectAssigneeSequence', {
      assigneeId: 'petitionsclerk',
      assigneeName: 'Test Petitionsclerk',
    });

    await test.runSequence('assignSelectedWorkItemsSequence');

    await test.runSequence('chooseWorkQueueSequence', {
      queue: 'my',
      box: 'inbox',
    });

    // no longer in our inbox!
    expect(
      test.getState('workQueue').find(item => {
        return item.isInitializeCreate && item.docketNumber === docketNumber;
      }),
    ).toBeUndefined();

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: docketNumber,
      documentId: documentId,
    });

    expect(test.getState('currentPage')).toEqual('DocumentDetail');

    await test.runSequence('submitPetitionToIRSHoldingQueueSequence');

    await generatePromise(1000, true); // TODO: remove sleep statements

    expect(test.getState('currentPage')).toEqual('DashboardPetitionsClerk');

    await test.runSequence('chooseWorkQueueSequence', {
      queue: 'section',
      box: 'outbox',
    });

    expect(test.getState('workQueue.0.caseStatus')).toEqual('Batched for IRS');
  });
};
