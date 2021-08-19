import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const petitionsClerkForwardsMessageWithAttachment = cerebralTest => {
  const { DOCKET_SECTION } = applicationContext.getConstants();
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: cerebralTest.getState(),
    });
  };

  return it('petitions clerk forwards the message with an added attachment', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === cerebralTest.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();

    await cerebralTest.runSequence('gotoMessageDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
      parentMessageId: foundMessage.parentMessageId,
    });

    await cerebralTest.runSequence('openForwardMessageModalSequence');

    expect(cerebralTest.getState('modal.form')).toMatchObject({
      parentMessageId: foundMessage.parentMessageId,
      subject: cerebralTest.testMessageSubject,
    });

    await cerebralTest.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'identity theft is not a joke, Jim',
    });

    await cerebralTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: DOCKET_SECTION,
      },
    );

    const messageDocument = getHelper().documents[0];
    cerebralTest.testMessageDocumentId = messageDocument.docketEntryId;

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: messageDocument.docketEntryId,
    });

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '1805d1ab-18d0-43ec-bafb-654e83405416', //docketclerk
    });

    await cerebralTest.runSequence('forwardMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('messageViewerDocumentToDisplay')).toEqual({
      documentId: messageDocument.docketEntryId,
    });
    expect(cerebralTest.getState('iframeSrc')).toBeDefined();
  });
};
