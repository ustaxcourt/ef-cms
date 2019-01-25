export default test => {
  return it('Docket clerk views document detail', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });
    expect(test.getState('currentPage')).toEqual('DocumentDetail');
    const caseDetail = test.getState('caseDetail');
    expect(caseDetail.docketNumber).toEqual(test.docketNumber);
    let workItem;
    caseDetail.documents.forEach(document =>
      document.workItems.forEach(item => {
        if (item.workItemId === test.stipulatedDecisionWorkItemId) {
          workItem = item;
        }
      }),
    );
    expect(workItem).toMatchObject({
      assigneeId: 'seniorattorney',
      assigneeName: 'Test Seniorattorney',
    });

    expect(workItem.messages[0]).toMatchObject({
      message: test.selectedWorkItem.messages[0].message,
      userId: test.selectedWorkItem.messages[0].userId,
      sentBy: test.selectedWorkItem.messages[0].sentBy,
    });
  });
};
