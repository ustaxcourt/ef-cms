import { formattedWorkQueue as formattedWorkQueueComputed } from '@web-client/presenter/computeds/formattedWorkQueue';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

export const docketClerkViewsSectionInboxHighPriority = cerebralTest => {
  const formattedWorkQueue = withAppContextDecorator(
    formattedWorkQueueComputed,
  );
  return it('Docket clerk views section inbox with a high priority item', async () => {
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
    // the work item created is high priority and has a trial date
    expect(inProgressWorkItem!.highPriority).toEqual(true);
    expect(inProgressWorkItem!.trialDate).toBeDefined();
  });
};
