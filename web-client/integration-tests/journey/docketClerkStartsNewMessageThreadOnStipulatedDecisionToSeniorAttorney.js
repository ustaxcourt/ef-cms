export default test => {
  return it('Docket clerk starts a new message thread on the Stipulated Decision document to senior attorney', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.stipulatedDecisionDocumentId,
    });

    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('createWorkItemSequence');

    expect(test.getState('validationErrors')).toEqual({
      assigneeId: 'Select a recipient',
      message: 'Message is required.',
      section: 'Select a section.',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'section',
      value: 'seniorattorney',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'assigneeId',
      value: '6805d1ab-18d0-43ec-bafb-654e83405416', // seniorattorney
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'message',
      value: 'this is a new thread test message to a senior attorney',
    });

    await test.runSequence('createWorkItemSequence');

    const documents = test.getState('caseDetail.documents');
    const stipulatedDecision = documents.find(
      document => document.documentId === test.stipulatedDecisionDocumentId,
    );
    const workItem = stipulatedDecision.workItems.find(
      workItem => workItem.assigneeName === 'Test Seniorattorney',
    );

    test.stipulatedDecisionWorkItemId = workItem.workItemId;
    expect(workItem).toMatchObject({
      assigneeName: 'Test Seniorattorney',
      isInitializeCase: false,
      messages: [
        {
          from: 'Test Docketclerk',
          fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'this is a new thread test message to a senior attorney',
          to: 'Test Seniorattorney',
          toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
      section: 'seniorattorney',
      sentBy: 'Test Docketclerk',
    });

    expect(test.getState('form')).toEqual({});

    await test.runSequence('gotoDashboardSequence');
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });
    let sectionOutboxWorkQueue = test.getState('workQueue');
    let answerWorkItem = sectionOutboxWorkQueue.find(
      workItem => workItem.workItemId === test.stipulatedDecisionWorkItemId,
    );
    expect(answerWorkItem.messages[0]).toMatchObject({
      message: 'this is a new thread test message to a senior attorney',
    });
  });
};
