import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerk1RepliesToMessage = test => {
  return it('petitions clerk 1 replies to the message they received', async () => {
    await test.runSequence('openReplyToMessageModalSequence');

    expect(test.getState('modal.form')).toMatchObject({
      parentMessageId: test.parentMessageId,
      subject: test.testMessageSubject,
      to: 'Test Petitionsclerk',
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Identity theft is not a joke, Jim.',
    });

    await test.runSequence('replyToCaseMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('messageDetail').length).toEqual(2);

    await refreshElasticsearchIndex();

    //message should no longer be shown in inbox
    await test.runSequence('gotoCaseMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).not.toBeDefined();
  });
};
