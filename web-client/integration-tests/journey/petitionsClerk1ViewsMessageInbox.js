export const petitionsClerk1ViewsMessageInbox = test => {
  return it('petitions clerk 1 views their messages inbox', async () => {
    await test.runSequence('gotoCaseMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();

    test.testMessageDocumentId = foundMessage.attachments[0].documentId;
    test.parentMessageId = foundMessage.parentMessageId;
  });
};
