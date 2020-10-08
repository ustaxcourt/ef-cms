export const adcsSignsProposedStipulatedDecisionFromMessage = test => {
  return it('adc signs the proposed stipulated decision from message', async () => {
    await test.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
    expect(foundMessage.attachments.length).toEqual(1);

    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: foundMessage.parentMessageId,
    });
    expect(test.getState('currentPage')).toEqual('MessageDetail');

    await test.runSequence('gotoSignOrderSequence', {
      docketEntryId: test.proposedStipDecisionDocketEntryId,
      docketNumber: test.docketNumber,
      parentMessageId: foundMessage.parentMessageId,
      redirectUrl: `/messages/${test.docketNumber}/message-detail/${foundMessage.parentMessageId}?docketEntryId=${test.proposedStipDecisionDocketEntryId}`,
    });
    expect(test.getState('currentPage')).toEqual('SignOrder');

    await test.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await test.runSequence('saveDocumentSigningSequence');

    expect(test.getState('currentPage')).toEqual('MessageDetail');
    expect(test.getState('messageDetail.0.attachments').length).toEqual(2);
    test.stipDecisionDocketEntryId = test.getState(
      'messageDetail.0.attachments.1.documentId',
    );
  });
};
