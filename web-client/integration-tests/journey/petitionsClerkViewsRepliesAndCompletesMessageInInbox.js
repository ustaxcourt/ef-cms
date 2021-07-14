export const petitionsClerkViewsRepliesAndCompletesMessageInInbox =
  cerebralTest => {
    return it('petitions clerk views, replies, and completes messsage in inbox', async () => {
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

      cerebralTest.parentMessageId = foundMessage.parentMessageId;

      await cerebralTest.runSequence('gotoMessageDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
        parentMessageId: cerebralTest.parentMessageId,
      });

      await cerebralTest.runSequence('openReplyToMessageModalSequence');

      expect(cerebralTest.getState('modal.form')).toMatchObject({
        parentMessageId: cerebralTest.parentMessageId,
        subject: cerebralTest.testMessageSubject,
        to: 'Test Petitionsclerk',
      });

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'form.message',
        value: 'Millions of families suffer from it every year.',
      });

      await cerebralTest.runSequence('replyToMessageSequence');

      await cerebralTest.runSequence('openCompleteMessageModalSequence');

      await cerebralTest.runSequence('updateModalValueSequence', {
        key: 'form.message',
        value: 'Win, Win win no matter what',
      });

      await cerebralTest.runSequence('completeMessageSequence');
    });
  };
