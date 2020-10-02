import { NewMessage } from '../../../shared/src/business/entities/NewMessage';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { PETITIONS_SECTION } = applicationContext.getConstants();

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments = test => {
  expect(test.getState('messagesSectionCount')).toBe(0);
  expect(test.getState('messagesInboxCount')).toBe(0);

  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: test.getState(),
    });
  };

  return it('petitions clerk creates new message on a case with the maximum allowed attachments', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCreateMessageModalSequence');

    await test.runSequence('updateSectionInCreateMessageModalSequence', {
      key: 'toSection',
      value: PETITIONS_SECTION,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '4805d1ab-18d0-43ec-bafb-654e83405416', //petitionsclerk1
    });

    const messageDocument = getHelper().documents[0];
    test.testMessageDocumentId = messageDocument.docketEntryId;

    await test.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: test.testMessageDocumentId,
    });

    expect(test.getState('modal.form.subject')).toEqual(
      messageDocument.documentType,
    );

    // Add four more attachments to reach the maximum of five.
    for (let i = 0; i < 4; i++) {
      // currently doesn't matter if we add the same document over and over
      await test.runSequence('updateMessageModalAttachmentsSequence', {
        documentId: test.testMessageDocumentId,
      });
    }

    const helper = getHelper();
    expect(helper.showAddDocumentForm).toEqual(false);
    expect(helper.showAddMoreDocumentsButton).toEqual(false);
    expect(helper.showMessageAttachments).toEqual(true);

    await test.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: 'what kind of bear is best?',
    });

    await test.runSequence('createMessageSequence');

    expect(test.getState('validationErrors')).toEqual({
      message: NewMessage.VALIDATION_ERROR_MESSAGES.message,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'bears, beets, battlestar galactica',
    });

    await test.runSequence('createMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
