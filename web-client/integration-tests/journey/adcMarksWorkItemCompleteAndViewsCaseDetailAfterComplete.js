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
  });
};
