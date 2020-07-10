export const docketClerkViewsForwardedMessageInInbox = test => {
  return it('docket clerk views the forwarded message they were sent in their inbox', async () => {
    await test.runSequence('gotoCaseMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
    expect(foundMessage.from).toEqual('Test Petitionsclerk');
  });
};
