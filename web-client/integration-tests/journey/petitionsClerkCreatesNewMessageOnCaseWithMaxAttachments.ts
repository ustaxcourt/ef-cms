import { NewMessage } from '../../../shared/src/business/entities/NewMessage';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { PETITIONS_SECTION } = applicationContext.getConstants();

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments =
  cerebralTest => {
    expect(cerebralTest.getState('messagesSectionCount')).toBe(0);
    expect(cerebralTest.getState('messagesInboxCount')).toBe(0);

    const getHelper = () => {
      return runCompute(messageModalHelper, {
        state: cerebralTest.getState(),
      });
    };

    return it('petitions clerk creates new message on a case with the maximum allowed attachments', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      await cerebralTest.runSequence('openCreateMessageModalSequence');

      await cerebralTest.runSequence(
        'updateSectionInCreateMessageModalSequence',
        {
          key: 'toSection',
          value: PETITIONS_SECTION,
        },
      );

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'toUserId',
        value: '4805d1ab-18d0-43ec-bafb-654e83405416', //petitionsclerk1
      });

      const messageDocument = getHelper().documents[0];
      cerebralTest.testMessageDocumentId = messageDocument.docketEntryId;

      await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
        documentId: cerebralTest.testMessageDocumentId,
      });

      expect(cerebralTest.getState('modal.form.subject')).toEqual(
        messageDocument.documentType,
      );

      // Add four more attachments to reach the maximum of five.
      for (let i = 0; i < 4; i++) {
        // currently doesn't matter if we add the same document over and over
        await cerebralTest.runSequence(
          'updateMessageModalAttachmentsSequence',
          {
            documentId: cerebralTest.testMessageDocumentId,
          },
        );
      }

      const helper = getHelper();
      expect(helper.showAddDocumentForm).toEqual(false);
      expect(helper.showAddMoreDocumentsButton).toEqual(false);
      expect(helper.showMessageAttachments).toEqual(true);

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'subject',
        value: 'what kind of bear is best?',
      });

      await cerebralTest.runSequence('createMessageSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({
        message: NewMessage.VALIDATION_ERROR_MESSAGES.message[0].message,
      });

      await cerebralTest.runSequence('updateModalFormValueSequence', {
        key: 'message',
        value: 'bears, beets, battlestar galactica',
      });

      await cerebralTest.runSequence('createMessageSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await refreshElasticsearchIndex();
    });
  };
