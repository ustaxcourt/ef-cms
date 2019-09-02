import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export default (test, message) => {
  it('Views an unread message marking it read', async () => {
    const workQueue = await runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const workItem = workQueue.find(
      item => item.currentMessage.message == message,
    );

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: workItem.docketNumber,
      documentId: workItem.document.documentId,
      messageId: workItem.currentMessage.messageId,
      workItemIdToMarkAsRead: workItem.workItemId,
    });

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
      workQueueIsMessages: true,
    });

    const updatedWorkQueue = await runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const readWorkItem = updatedWorkQueue.find(
      item => item.workItemId == workItem.workItemId,
    );

    expect(readWorkItem.showUnreadIndicators).toBeFalsy();
  });
};
