export default test => {
  return it('Docket clerk views their dashboard and should not expect an individual work queue item, but should expect the docket section item', async () => {
    await test.runSequence('gotoDashboardSequence');
    const workItem = test
      .getState('workQueue')
      .find(item => item.workItemId === test.workItemId);
    const sectionWorkItems = test
      .getState('sectionWorkQueue')
      .filter(item => item.docketNumber === test.docketNumber);
    expect(workItem).toBeUndefined();
    expect(sectionWorkItems.length).toEqual(2);
    test.answerWorkItemId = sectionWorkItems.find(
      item => item.document.documentType === 'Answer',
    ).workItemId;
    test.stipulatedDecisionWorkItemId = sectionWorkItems.find(
      item => item.document.documentType === 'Stipulated Decision',
    ).workItemId;
  });
};
