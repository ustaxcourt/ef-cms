import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkAssignWorkItemToSelf = cerebralTest => {
  return it('Docket clerk assigns the selected work items to self', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    let sectionWorkQueue = cerebralTest.getState('workQueue');

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const selectedWorkItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );

    cerebralTest.docketEntryId = selectedWorkItem.docketEntry.docketEntryId;

    expect(selectedWorkItem).toMatchObject({
      assigneeId: null,
    });

    cerebralTest.setState('selectedWorkItems', [selectedWorkItem]);
    cerebralTest.setState('assigneeName', 'Test Docketclerk');
    cerebralTest.setState('assigneeId', '1805d1ab-18d0-43ec-bafb-654e83405416');

    await cerebralTest.runSequence('assignSelectedWorkItemsSequence');

    sectionWorkQueue = cerebralTest.getState('workQueue');
    const assignedSelectedWorkItem = sectionWorkQueue.find(
      workItem => workItem.workItemId === selectedWorkItem.workItemId,
    );
    expect(assignedSelectedWorkItem).toMatchObject({
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });
};
