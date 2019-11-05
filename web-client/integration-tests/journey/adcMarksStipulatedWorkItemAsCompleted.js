import { formattedWorkQueue as formattedWorkQueueComputed } from '../../src/presenter/computeds/formattedWorkQueue';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

export default test => {
  return it('ADC marks the work item as completed', async () => {
    await test.runSequence('updateCompleteFormValueSequence', {
      key: 'completeMessage',
      value: 'good job',
      workItemId: test.stipulatedDecisionWorkItemId,
    });
    await test.runSequence('submitCompleteSequence', {
      workItemId: test.stipulatedDecisionWorkItemId,
    });
    const workItems = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const workItem = workItems.find(
      item => item.workItemId === test.stipulatedDecisionWorkItemId,
    );
    expect(workItem).toBeUndefined();
  });
};
