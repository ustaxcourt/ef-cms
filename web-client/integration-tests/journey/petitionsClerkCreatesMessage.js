export default (test, message) => {
  return it('Petitions clerk sends message to petitionsclerk1', async () => {
    const firstCase = test.petitionerNewCases.reduce((prev, current) =>
      prev.createdAt < current.createdAt ? prev : current,
    );

    const firstDocument = firstCase.documents.reduce((prev, current) =>
      prev.createdAt < current.createdAt ? prev : current,
    );

    const workItem = firstDocument.workItems.reduce((prev, current) =>
      prev.createdAt < current.createdAt ? prev : current,
    );

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: firstCase.docketNumber,
      documentId: firstDocument.documentId,
    });

    // petitionsclerk1
    const assigneeId = '4805d1ab-18d0-43ec-bafb-654e83405416';

    test.setState('form', {
      [workItem.workItemId]: {
        assigneeId: assigneeId,
        forwardMessage: message,
        section: 'petitions',
      },
    });

    await test.runSequence('submitForwardSequence', {
      workItemId: workItem.workItemId,
    });

    const caseDetail = test.getState('caseDetail');
    let updatedWorkItem;
    caseDetail.documents.forEach(document =>
      document.workItems.forEach(item => {
        if (item.workItemId === workItem.workItemId) {
          updatedWorkItem = item;
        }
      }),
    );

    test.workItemToCheck = workItem.workItemId;

    expect(updatedWorkItem.assigneeId).toEqual(assigneeId);
  });
};
