export const docketClerkViewsDocument = test => {
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
        if (item.workItemId === test.selectedWorkItem.workItemId) {
          workItem = item;
        }
      }),
    );
    expect(workItem).toMatchObject({
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Docketclerk',
    });

    expect(workItem.messages[0]).toMatchObject({
      from: test.selectedWorkItem.messages[0].from,
      fromUserId: test.selectedWorkItem.messages[0].fromUserId,
      message: test.selectedWorkItem.messages[0].message,
    });
  });
};
