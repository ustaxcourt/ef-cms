import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export default test => {
  return it('Petitions clerk runs IRS batch', async () => {
    await test.runSequence('gotoDashboardSequence');

    // send to IRS
    await test.runSequence('runBatchProcessSequence');

    // view my outbox
    await test.runSequence('gotoDashboardSequence', {
      box: 'outbox',
      queue: 'my',
      workQueueIsMessages: false,
    });

    const myOutboxWorkQueue = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    // our petition is in the outbox
    expect(
      myOutboxWorkQueue.find(
        workItem => workItem.docketNumber === test.docketNumber,
      ),
    ).toBeDefined();

    // view the IRS batch queue
    await test.runSequence('gotoDashboardSequence', {
      box: 'batched',
      queue: 'my',
      workQueueIsMessages: false,
    });

    const myBatchedWorkQueue = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    // our petition is no longer in batch queue
    expect(
      myBatchedWorkQueue.find(
        workItem => workItem.docketNumber === test.docketNumber,
      ),
    ).toBeUndefined();
  });
};
