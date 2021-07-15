export const petitionsClerkVerifiesCompletedMessageNotInInbox =
  cerebralTest => {
    return it('petitions clerk verifies the completed message is not in their inbox', async () => {
      await cerebralTest.runSequence('gotoMessagesSequence', {
        box: 'inbox',
        queue: 'my',
      });

      const messages = cerebralTest.getState('messages');

      const foundMessage = messages.find(
        message => message.subject === cerebralTest.testMessageSubject,
      );

      expect(foundMessage).toBeUndefined();
    });
  };
