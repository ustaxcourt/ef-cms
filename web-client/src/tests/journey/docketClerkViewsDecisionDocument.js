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
      message: 'a Stipulated Decision filed by respondent is ready for review',
      userId: 'respondent',
      sentBy: 'Test Respondent',
    });
  });
};
