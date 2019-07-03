export default test => {
  return it('Docket clerk views decision document detail', async () => {
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
      assigneeId: null,
      assigneeName: null,
    });

    expect(workItem.messages[0]).toMatchObject({
      from: 'Test Respondent',
      fromUserId: '5805d1ab-18d0-43ec-bafb-654e83405416',
      message:
        'Proposed Stipulated Decision filed by Respondent is ready for review.',
    });
  });
};
