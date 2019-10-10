export default test => {
  return it('Docket clerk views their messages and should not expect an individual work queue item, but should expect the docket section item', async () => {
    await test.runSequence('gotoMessagesSequence');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });
    const workItem = test
      .getState('workQueue')
      .find(item => item.workItemId === test.workItemId);
    expect(workItem).toBeUndefined();

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
    });
    const sectionWorkItems = test
      .getState('workQueue')
      .filter(item => item.docketNumber === test.docketNumber);
    expect(sectionWorkItems.length).toEqual(4);
    test.answerDocumentId = sectionWorkItems.find(
      item => item.document.documentType === 'Answer',
    ).document.documentId;
    test.stipulatedDecisionDocumentId = sectionWorkItems.find(
      item => item.document.documentType === 'Proposed Stipulated Decision',
    ).document.documentId;
    test.answerWorkItemId = sectionWorkItems.find(
      item => item.document.documentType === 'Answer',
    ).workItemId;
    test.stipulatedDecisionWorkItemId = sectionWorkItems.find(
      item => item.document.documentType === 'Proposed Stipulated Decision',
    ).workItemId;
  });
};
