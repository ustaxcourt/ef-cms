import { runCompute } from 'cerebral/test';
import { extractedDocument } from '../../presenter/computeds/extractDocument';
import { extractedWorkItems } from '../../presenter/computeds/extractWorkItems';

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
    const workItems = runCompute(extractedWorkItems, {
      state: {
        ...test.getState(),
        extractedDocument: document,
      },
    });
    const workItem = workItems.find(
      item => item.workItemId === test.stipulatedDecisionWorkItemId,
    );
    expect(workItem).toBeUndefined();
  });
};
