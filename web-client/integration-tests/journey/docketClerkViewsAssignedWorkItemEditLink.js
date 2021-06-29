import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const docketClerkViewsAssignedWorkItemEditLink = test => {
  return it('Docket clerk views Individual Document QC - Inbox', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('my');
    expect(workQueueToDisplay.box).toEqual('inbox');

    const workQueueFormatted = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const inboxWorkItem = workQueueFormatted.find(
      workItem => workItem.docketEntry.docketEntryId === test.docketEntryId,
    );

    expect(inboxWorkItem.editLink).toContain('/edit');

    await test.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: test.docketEntryId,
      docketNumber: test.docketNumber,
    });
  });
};
