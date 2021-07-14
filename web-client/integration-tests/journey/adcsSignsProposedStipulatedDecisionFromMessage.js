export const adcsSignsProposedStipulatedDecisionFromMessage = cerebralTest => {
  return it('adc signs the proposed stipulated decision from message', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
    expect(foundMessage.attachments.length).toEqual(1);

    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: foundMessage.parentMessageId,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('MessageDetail');

    await cerebralTest.runSequence('gotoSignOrderSequence', {
      docketEntryId: cerebralTest.proposedStipDecisionDocketEntryId,
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: foundMessage.parentMessageId,
      redirectUrl: `/messages/${cerebralTest.docketNumber}/message-detail/${foundMessage.parentMessageId}?docketEntryId=${cerebralTest.proposedStipDecisionDocketEntryId}`,
    });
    expect(cerebralTest.getState('currentPage')).toEqual('SignOrder');

    await cerebralTest.runSequence('setPDFSignatureDataSequence', {
      signatureData: {
        scale: 1,
        x: 100,
        y: 100,
      },
    });
    await cerebralTest.runSequence('saveDocumentSigningSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('MessageDetail');
    expect(cerebralTest.getState('messageDetail.0.attachments').length).toEqual(
      2,
    );
    cerebralTest.stipDecisionDocketEntryId = cerebralTest.getState(
      'messageDetail.0.attachments.1.documentId',
    );
  });
};
