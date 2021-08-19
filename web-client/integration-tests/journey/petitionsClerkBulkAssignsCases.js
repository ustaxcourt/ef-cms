import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const petitionsClerkBulkAssignsCases = (cerebralTest, createdCases) => {
  return it('Petitions clerk bulk assigns cases', async () => {
    const workQueueFormatted = await runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const selectedWorkItems = createdCases.map(newCase => {
      const workItem = workQueueFormatted.find(
        w => w.docketNumber === newCase.docketNumber,
      );

      return {
        workItemId: workItem.workItemId,
      };
    });

    const currentUserId = cerebralTest.getState('user').userId;

    cerebralTest.setState('assigneeId', currentUserId);
    cerebralTest.setState('assigneeName', 'Petitions Clerk1');
    cerebralTest.setState('selectedWorkItems', selectedWorkItems);

    const result = await cerebralTest.runSequence(
      'assignSelectedWorkItemsSequence',
    );

    const { workQueue } = result.state;
    selectedWorkItems.forEach(assignedWorkItem => {
      const workItem = workQueue.find(
        item => (item.workItemId = assignedWorkItem.workItemId),
      );

      expect(workItem.assigneeId).toEqual(currentUserId);
    });
  });
};
