import { Case } from '../../../shared/src/business/entities/cases/Case';
import { documentDetailHelper as documentDetailHelperComputed } from '../../src/presenter/computeds/documentDetailHelper';
import { runCompute } from 'cerebral/test';
import { waitForRouter } from '../helpers';
import { withAppContextDecorator } from '../../src/withAppContext';

const documentDetailHelper = withAppContextDecorator(
  documentDetailHelperComputed,
);

export default test => {
  return it('Petitions clerk views IRS Holding Queue', async () => {
    await test.runSequence('gotoMessagesSequence');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });

    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'my',
      workQueueIsInternal: false,
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'batched',
      queue: 'section',
      workQueueIsInternal: false,
    });

    // verify item in general status older than 7 days does not show
    expect(
      test.getState('workQueue').find(item => {
        return item.isInitializeCreate && item.docketNumber === '199-18';
      }),
    ).toBeUndefined();

    let workItem = test
      .getState('workQueue')
      .find(
        item =>
          item.docketNumber === test.docketNumber &&
          item.caseStatus === Case.STATUS_TYPES.batchedForIRS,
      );

    // verify that the section workitems are in state
    expect(test.getState('workQueue').length).toBeGreaterThan(0);
    // the first item in the outbox should be the Petition batched for IRS from the previous test
    expect(workItem).toBeDefined();
    // goto the first work item in the section queue outbox, the one we just batched for IRS
    const { docketNumber } = workItem;
    const { documentId } = workItem.document;
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber,
      documentId,
    });

    const documentDetailHelperBatched = runCompute(documentDetailHelper, {
      state: test.getState(),
    });
    expect(documentDetailHelperBatched.showCaseDetailsView).toEqual(true);
    expect(documentDetailHelperBatched.showCaseDetailsEdit).toEqual(false);
    expect(documentDetailHelperBatched.showServeToIrsButton).toEqual(false);
    expect(documentDetailHelperBatched.showRecallButton).toEqual(true);

    await test.runSequence('submitRecallPetitionFromIRSHoldingQueueSequence');
    await test.runSequence('gotoMessagesSequence');
    await waitForRouter();

    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'batched',
      queue: 'section',
      workQueueIsInternal: false,
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: false,
    });

    expect(test.getState('workQueueToDisplay')).toEqual({
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: false,
    });

    expect(test.getState('workQueue.0.caseStatus')).toEqual(
      Case.STATUS_TYPES.recalled,
    );
    const recalledWorkItem = test
      .getState('workQueue')
      .find(
        workItem =>
          workItem.docketNumber === test.docketNumber &&
          workItem.document.documentType === 'Petition',
      );

    const foundMessage = recalledWorkItem.messages.find(message => {
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
    expect(test.getState('workQueue.0.caseStatus')).toEqual(
      Case.STATUS_TYPES.recalled,
    );
    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.recalled,
    );

    const documentDetailHelperRecalled = runCompute(documentDetailHelper, {
      state: test.getState(),
    });

    expect(documentDetailHelperRecalled.showCaseDetailsView).toEqual(false);
    expect(documentDetailHelperRecalled.showCaseDetailsEdit).toEqual(true);
    expect(documentDetailHelperRecalled.showServeToIrsButton).toEqual(true);
    expect(documentDetailHelperRecalled.showRecallButton).toEqual(false);

    // assign to another petitionsclerk
    workItem = test.getState('workQueue').find(item => {
      return item.isInitializeCase && item.docketNumber === docketNumber;
    });

    expect(workItem.showComplete).toBeFalsy();
    expect(workItem.showSendTo).toBeFalsy();

    await test.runSequence('selectWorkItemSequence', {
      workItem: workItem,
    });

    await test.runSequence('selectAssigneeSequence', {
      assigneeId: '3805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Petitionsclerk',
    });

    await test.runSequence('assignSelectedWorkItemsSequence');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
      workQueueIsInternal: false,
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
    await waitForRouter();

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'batched',
      queue: 'section',
      workQueueIsInternal: false,
    });

    workItem = test
      .getState('workQueue')
      .find(
        item =>
          item.docketNumber === test.docketNumber &&
          item.caseStatus === Case.STATUS_TYPES.batchedForIRS,
      );
    expect(workItem).toBeDefined();
  });
};
