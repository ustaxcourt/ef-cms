export const docketClerkViewsForwardedMessageInInbox = cerebralTest => {
  return it('docket clerk views the forwarded message they were sent in their inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
    expect(foundMessage.from).toEqual('Test Petitionsclerk');
  });
};
