export const petitionsClerkViewsSentMessagesBox = test => {
  return it('petitions clerk views their sent messages box', async () => {
    await test.runSequence('gotoCaseMessagesSequence', {
      box: 'outbox',
      queue: 'my',
    });

    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
  });
};
