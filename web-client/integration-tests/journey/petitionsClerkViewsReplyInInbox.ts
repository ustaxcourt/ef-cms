export const petitionsClerkViewsReplyInInbox = cerebralTest => {
  return it('petitions clerk views the reply they were sent in their inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
    expect(foundMessage.from).toEqual('Test Petitionsclerk1');
  });
};
