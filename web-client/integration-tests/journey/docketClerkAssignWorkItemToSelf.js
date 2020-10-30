import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkAssignWorkItemToSelf = test => {
  return it('Docket clerk assigns the selected work items to self', async () => {
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    let sectionWorkQueue = test.getState('workQueue');

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const selectedWorkItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === test.docketNumber,
    );

    expect(selectedWorkItem).toMatchObject({
      assigneeId: null,
    });

    test.setState('selectedWorkItems', [selectedWorkItem]);
    test.setState('assigneeName', 'Test Docketclerk');
    test.setState('assigneeId', '1805d1ab-18d0-43ec-bafb-654e83405416');

    await test.runSequence('assignSelectedWorkItemsSequence');

    sectionWorkQueue = test.getState('workQueue');
    const assignedSelectedWorkItem = sectionWorkQueue.find(
      workItem => workItem.workItemId === selectedWorkItem.workItemId,
    );
    expect(assignedSelectedWorkItem).toMatchObject({
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });
};
