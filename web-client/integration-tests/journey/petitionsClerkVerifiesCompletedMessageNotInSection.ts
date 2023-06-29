export const petitionsClerkVerifiesCompletedMessageNotInSection =
  cerebralTest => {
    return it('petitions clerk verifies the completed message is not in the section inbox', async () => {
      await cerebralTest.runSequence('gotoMessagesSequence', {
        box: 'inbox',
        queue: 'section',
      });

      const messages = cerebralTest.getState('messages');

      const foundMessage = messages.find(
        message => message.subject === cerebralTest.testMessageSubject,
      );

      expect(foundMessage).toBeUndefined();
    });
  };
