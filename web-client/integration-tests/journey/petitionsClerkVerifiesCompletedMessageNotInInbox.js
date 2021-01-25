export const petitionsClerkVerifiesCompletedMessageNotInInbox = test => {
  return it('petitions clerk verifies the completed message is not in their inbox', async () => {
    await test.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).toBeUndefined();
  });
};
