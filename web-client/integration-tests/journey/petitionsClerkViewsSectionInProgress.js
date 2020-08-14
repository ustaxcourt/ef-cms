import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export const petitionsClerkViewsSectionInProgress = test => {
  return it('Petitions Clerk views section inProgress', async () => {
    await test.runSequence('gotoWorkQueueSequence');
    expect(test.getState('currentPage')).toEqual('WorkQueue');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inProgress',
      queue: 'section',
    });

    const workQueueToDisplay = test.getState('workQueueToDisplay');

    expect(workQueueToDisplay.queue).toEqual('section');
    expect(workQueueToDisplay.box).toEqual('inProgress');

    const formattedWorkItem = runCompute(formattedWorkQueue, {
      state: test.getState(),
    }).find(item => item.docketNumber === test.docketNumber);

    expect(formattedWorkItem.editLink).toContain('/review');
  });
};
