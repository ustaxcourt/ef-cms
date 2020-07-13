import { extractedPendingMessagesFromCaseDetail as extractedPendingMessagesFromCaseDetailComputed } from '../../src/presenter/computeds/extractPendingMessagesFromCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const extractedPendingMessagesFromCaseDetail = withAppContextDecorator(
  extractedPendingMessagesFromCaseDetailComputed,
);

export const adcMarksWorkItemCompleteAndViewsCaseDetailAfterComplete = test => {
  return it('ADC marks stipulated work item as completed and views case detail', async () => {
    await test.runSequence('updateCompleteFormValueSequence', {
      key: 'completeMessage',
      value: 'good job',
      workItemId: test.stipulatedDecisionWorkItemId,
    });
    await test.runSequence('submitCompleteSequence', {
      workItemId: test.stipulatedDecisionWorkItemId,
    });

    test.setState('caseDetail', {});
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    const pendingMessages = runCompute(extractedPendingMessagesFromCaseDetail, {
      state: test.getState(),
    });
    const workItem = pendingMessages.find(
      item => item.workItemId === test.stipulatedDecisionWorkItemId,
    );
    expect(workItem).toBeUndefined();
  });
};
