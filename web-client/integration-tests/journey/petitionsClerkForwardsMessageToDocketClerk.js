import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { refreshElasticsearchIndex } from '../helpers';

export const petitionsClerkForwardsMessageToDocketClerk = test => {
  const { DOCKET_SECTION } = applicationContext.getConstants();

  return it('petitions clerk forwards the message to docket clerk', async () => {
    await test.runSequence('openForwardMessageModalSequence');

    expect(test.getState('modal.form')).toMatchObject({
      parentMessageId: test.parentMessageId,
      subject: test.testMessageSubject,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'Four years of malfeasance unreported. This cannot stand.',
    });

    await test.runSequence('forwardMessageSequence');

    expect(test.getState('validationErrors')).toEqual({
      toSection: expect.anything(),
      toUserId: expect.anything(),
    });

    await test.runSequence('updateSectionInCreateMessageModalSequence', {
      key: 'toSection',
      value: DOCKET_SECTION,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '1805d1ab-18d0-43ec-bafb-654e83405416', //docketclerk
    });

    await test.runSequence('forwardMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('messageDetail').length).toEqual(3);

    await refreshElasticsearchIndex();

    //message should no longer be shown in inbox
    await test.runSequence('gotoMessagesSequence', {
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
