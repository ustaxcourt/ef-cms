import { NewCaseMessage } from '../../../shared/src/business/entities/NewCaseMessage';
import { caseMessageModalHelper as caseMessageModalHelperComputed } from '../../src/presenter/computeds/caseMessageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const caseMessageModalHelper = withAppContextDecorator(
  caseMessageModalHelperComputed,
);

export const petitionsClerkCreatesNewMessageOnCaseWithMaxAttachments = test => {
  const getHelper = () => {
    return runCompute(caseMessageModalHelper, {
      state: test.getState(),
    });
  };

  return it('petitions clerk creates new message on a case with the maximum allowed attachments', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openCreateCaseMessageModalSequence');

    await test.runSequence('updateSectionInCreateCaseMessageModalSequence', {
      key: 'toSection',
      value: 'petitions',
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '4805d1ab-18d0-43ec-bafb-654e83405416', //petitionsclerk1
    });

    const messageDocument = getHelper().documents[0];
    test.testMessageDocumentId = messageDocument.documentId;

    await test.runSequence('updateCaseMessageModalAttachmentsSequence', {
      documentId: messageDocument.documentId,
    });

    expect(test.getState('modal.form.subject')).toEqual(
      messageDocument.documentType,
    );

    // Add four more attachments to reach the maximum of five.
    for (let i = 0; i < 4; i++) {
      // currently doesn't matter if we add the same document over and over
      await test.runSequence('updateCaseMessageModalAttachmentsSequence', {
        documentId: messageDocument.documentId,
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

    await test.runSequence('createCaseMessageSequence');

    expect(test.getState('validationErrors')).toEqual({
      message: NewCaseMessage.VALIDATION_ERROR_MESSAGES.message,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'bears, beets, battlestar galactica',
    });

    await test.runSequence('createCaseMessageSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
