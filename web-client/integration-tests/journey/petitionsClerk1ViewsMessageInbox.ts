export const petitionsClerk1ViewsMessageInbox = cerebralTest => {
  return it('petitions clerk 1 views their messages inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();

    cerebralTest.testMessageDocumentId = foundMessage.attachments[0].documentId;
    cerebralTest.parentMessageId = foundMessage.parentMessageId;

    expect(cerebralTest.getState('messagesSectionCount')).toBeGreaterThan(0);
    expect(cerebralTest.getState('messagesInboxCount')).toBeGreaterThan(0);
  });
};
