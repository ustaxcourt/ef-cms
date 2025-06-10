import { formattedWorkQueue as formattedWorkQueueComputed } from '@web-client/presenter/computeds/formattedWorkQueue';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

export const docketClerkViewsSectionInboxNotHighPriority = cerebralTest => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );
  return it('Docket clerk views section inbox without a high priority item', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('WorkQueue');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });

    const inboxQueue = runCompute(formattedWorkQueue, {
      state: cerebralTest.getState(),
    });
    const inProgressWorkItem = inboxQueue.find(
      workItem => workItem.docketNumber === cerebralTest.docketNumber,
    );
    // the work item should no longer be high priority after the case is removed from trial
    expect(inProgressWorkItem!.highPriority).toEqual(false);
    expect(inProgressWorkItem!.trialDate).toBeFalsy();
  });
};
