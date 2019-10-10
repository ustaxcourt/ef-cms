import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';
import { last } from 'lodash';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export default test => {
  return it('Docket clerk docket work queue messages', async () => {
    let sectionOutboxWorkQueue;
    let answerWorkItem;
    await test.runSequence('gotoMessagesSequence');

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
      workQueueIsInternal: true,
    });
    sectionOutboxWorkQueue = test.getState('workQueue');
    answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.answerWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message',
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: false,
    });

    const sectionWorkQueue = test.getState('workQueue');
    expect(sectionWorkQueue.length).toBeGreaterThanOrEqual(2);
    const workItem = sectionWorkQueue.find(
      workItem =>
        workItem.docketNumber === test.docketNumber &&
        workItem.document.documentType === 'Proposed Stipulated Decision',
    );
    expect(workItem).toBeDefined();
    test.documentId = workItem.document.documentId;
    test.workItemId = workItem.workItemId;

    expect(workItem.messages[0]).toMatchObject({
      from: 'Test Respondent',
      fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
      message:
        'Proposed Stipulated Decision filed by Respondent is ready for review.',
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: true,
    });
    sectionOutboxWorkQueue = test.getState('workQueue');
    answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.answerWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message',
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
      workQueueIsInternal: true,
    });
    sectionOutboxWorkQueue = test.getState('workQueue');
    answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.answerWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message',
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: false,
    });
    const formatted = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const lastFormatted = last(formatted);
    expect(lastFormatted.createdAtFormatted).toBeDefined();
    expect(lastFormatted.docketNumberWithSuffix).toEqual(
      `${test.docketNumber}W`,
    );
    expect(lastFormatted.messages[0].createdAtFormatted).toBeDefined();

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: false,
    });
  });
};
