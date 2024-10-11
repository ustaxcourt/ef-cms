import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkAssignWorkItemToSelf = (
  cerebralTest,
  caseDocketNumber?,
) => {
  return it('Docket clerk assigns the selected work items to self', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });
    const docketNumber = caseDocketNumber || cerebralTest.docketNumber;
    const selectedWorkItem = workQueueFormatted.find(
      workItem => workItem.docketNumber === docketNumber,
    );

    cerebralTest.docketEntryId = selectedWorkItem.docketEntry.docketEntryId;

    expect(selectedWorkItem.assigneeId).toBeUndefined();

    cerebralTest.setState('selectedWorkItems', [selectedWorkItem]);
    cerebralTest.setState('assigneeName', 'Test Docketclerk');
    cerebralTest.setState('assigneeId', '1805d1ab-18d0-43ec-bafb-654e83405416');

    await cerebralTest.runSequence('assignSelectedWorkItemsSequence');

    const sectionWorkQueue = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });
    const assignedSelectedWorkItem = sectionWorkQueue.find(
      workItem => workItem.workItemId === selectedWorkItem.workItemId,
    );
    expect(assignedSelectedWorkItem).toMatchObject({
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    });
  });
};
