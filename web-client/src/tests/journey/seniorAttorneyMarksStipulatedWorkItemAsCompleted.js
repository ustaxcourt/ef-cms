import { runCompute } from 'cerebral/test';
import { extractedDocument } from '../../presenter/computeds/extractDocument';

export default test => {
  return it('Senior Attorney marks the work item as completed', async () => {
    await test.runSequence('updateCompleteFormValueSequence', {
      workItemId: test.stipulatedDecisionWorkItemId,
      key: 'completeMessage',
      value: 'good job',
    });
    await test.runSequence('submitCompleteSequence', {
      workItemId: test.stipulatedDecisionWorkItemId,
    });
    const document = runCompute(extractedDocument, {
      state: test.getState(),
    });

    const workItem = document.workItems.find(
      item => item.workItemId === test.stipulatedDecisionWorkItemId,
    );
    expect(workItem).toBeUndefined();
  });
};
