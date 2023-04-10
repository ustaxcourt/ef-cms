import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkForwardsMessageToDocketClerk = cerebralTest => {
  const { DOCKET_SECTION } = applicationContext.getConstants();

  return it('petitions clerk forwards the message to docket clerk', async () => {
    await cerebralTest.runSequence('openForwardMessageModalSequence');

    expect(cerebralTest.getState('modal.form')).toMatchObject({
      parentMessageId: cerebralTest.parentMessageId,
      subject: cerebralTest.testMessageSubject,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Four years of malfeasance unreported. This cannot stand.',
    });

    await cerebralTest.runSequence('forwardMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({
      toSection: expect.anything(),
      toUserId: expect.anything(),
    });

    await cerebralTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: DOCKET_SECTION,
      },
    );

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '1805d1ab-18d0-43ec-bafb-654e83405416', //docketclerk
    });

    await cerebralTest.runSequence('forwardMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('messageDetail').length).toEqual(3);

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
