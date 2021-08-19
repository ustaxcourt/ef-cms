import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkViewsAssignedWorkItemEditLink = cerebralTest => {
  return it('Docket clerk views Individual Document QC - Inbox', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const workQueueToDisplay = cerebralTest.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inbox');

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });

    const inboxWorkItem = workQueueFormatted.find(
      workItem =>
        workItem.docketEntry.docketEntryId === cerebralTest.docketEntryId,
    );

    expect(inboxWorkItem.editLink).toContain('/edit');

    await cerebralTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });
  });
};
