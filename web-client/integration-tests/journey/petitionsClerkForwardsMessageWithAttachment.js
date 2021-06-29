import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const petitionsClerkForwardsMessageWithAttachment = test => {
  const { DOCKET_SECTION } = applicationContext.getConstants();
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: test.getState(),
    });
  };

  return it('petitions clerk forwards the message with an added attachment', async () => {
    await test.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = test.getState('messages');

    const foundMessage = messages.find(
      message => message.subject === test.testMessageSubject,
    );

    expect(foundMessage).toBeDefined();

    await test.runSequence('gotoMessageDetailSequence', {
      docketNumber: test.docketNumber,
      parentMessageId: foundMessage.parentMessageId,
    });

    await test.runSequence('openForwardMessageModalSequence');

    expect(test.getState('modal.form')).toMatchObject({
      parentMessageId: foundMessage.parentMessageId,
      subject: test.testMessageSubject,
    });

    await test.runSequence('updateModalValueSequence', {
      key: 'form.message',
      value: 'identity theft is not a joke, Jim',
    });

    await test.runSequence('updateSectionInCreateMessageModalSequence', {
      key: 'toSection',
      value: DOCKET_SECTION,
    });

    const messageDocument = getHelper().documents[0];
    test.testMessageDocumentId = messageDocument.docketEntryId;

    await test.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: messageDocument.docketEntryId,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '1805d1ab-18d0-43ec-bafb-654e83405416', //docketclerk
    });

    await test.runSequence('forwardMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('messageViewerDocumentToDisplay')).toEqual({
      documentId: messageDocument.docketEntryId,
    });
    expect(test.getState('iframeSrc')).toBeDefined();
  });
};
