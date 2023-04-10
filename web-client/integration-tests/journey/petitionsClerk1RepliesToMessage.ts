import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerk1RepliesToMessage = cerebralTest => {
  return it('petitions clerk 1 replies to the message they received', async () => {
    await cerebralTest.runSequence('openReplyToMessageModalSequence');

    expect(cerebralTest.getState('modal.form')).toMatchObject({
      parentMessageId: cerebralTest.parentMessageId,
      subject: cerebralTest.testMessageSubject,
      to: 'Test Petitionsclerk',
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Identity theft is not a joke, Jim.',
    });

    await cerebralTest.runSequence('replyToMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('messageDetail').length).toEqual(2);

    await refreshElasticsearchIndex();

    //message should no longer be shown in inbox
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    expect(foundMessage).not.toBeDefined();
  });
};
