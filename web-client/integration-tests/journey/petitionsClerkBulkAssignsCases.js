import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const petitionsClerkBulkAssignsCases = (test, createdCases) => {
  return it('Petitions clerk bulk assigns cases', async () => {
    const workQueueFormatted = await runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const selectedWorkItems = createdCases.map(newCase => {
      const workItem = workQueueFormatted.find(
        w => w.docketNumber === newCase.docketNumber,
      );

      return {
        workItemId: workItem.workItemId,
      };
    });

    const currentUserId = test.getState('user').userId;

    test.setState('assigneeId', currentUserId);
    test.setState('assigneeName', 'Petitions Clerk1');
    test.setState('selectedWorkItems', selectedWorkItems);

    const result = await test.runSequence('assignSelectedWorkItemsSequence');

    const { workQueue } = result.state;
    selectedWorkItems.forEach(assignedWorkItem => {
      const workItem = workQueue.find(
        item => (item.workItemId = assignedWorkItem.workItemId),
      );

      expect(workItem.assigneeId).toEqual(currentUserId);
    });
  });
};
