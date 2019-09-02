export default test => {
  return it('Docket clerk starts a new message thread on the Answer document', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.answerDocumentId,
    });

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('createWorkItemSequence');

    expect(test.getState('validationErrors')).toEqual({
      assigneeId: 'Recipient is required.',
      message: 'Message is required.',
      section: 'Section is required.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'section',
      value: 'docket',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'assigneeId',
      value: '2805d1ab-18d0-43ec-bafb-654e83405416', // docketclerk1
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'message',
      value: 'this is a new thread test message',
    });

    await test.runSequence('createWorkItemSequence');

    const documents = test.getState('caseDetail.documents');
    const answer = documents.find(
      document => document.documentId === test.answerDocumentId,
    );
    const workItem = answer.workItems.find(
      workItem => workItem.sentBy === 'Test Docketclerk',
    );

    test.answerWorkItemId = workItem.workItemId;
    expect(workItem).toMatchObject({
      assigneeName: 'Test Docketclerk1',
      isInitializeCase: false,
      messages: [
        {
          from: 'Test Docketclerk',
          fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'this is a new thread test message',
          to: 'Test Docketclerk1',
          toUserId: '2805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      section: 'docket',
      sentBy: 'Test Docketclerk',
    });

    expect(test.getState('form')).toEqual({});

    await test.runSequence('gotoDashboardSequence');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
      workQueueIsMessages: true,
    });
    let sectionOutboxWorkQueue = test.getState('workQueue');
    let answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.answerWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message',
    });
  });
};
