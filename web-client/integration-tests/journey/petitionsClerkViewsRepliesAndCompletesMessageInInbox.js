export const petitionsClerkViewsRepliesAndCompletesMessageInInbox = test => {
  return it('petitions clerk views, replies, and completes messsage in inbox', async () => {
    await test.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();
    expect(foundMessage.from).toEqual('Test Petitionsclerk');

    test.parentMessageId = foundMessage.parentMessageId;

    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: test.parentMessageId,
    });

    await test.runSequence('openReplyToMessageModalSequence');

    expect(test.getState('modal.form')).toMatchObject({
      parentMessageId: test.parentMessageId,
      subject: test.testMessageSubject,
      to: 'Test Petitionsclerk',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Millions of families suffer from it every year.',
    });

    await test.runSequence('replyToMessageSequence');

    await test.runSequence('openCompleteMessageModalSequence');

    await test.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Win, Win win no matter what',
    });

    await test.runSequence('completeMessageSequence');
  });
};
