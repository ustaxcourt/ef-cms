import { NewMessage } from '../../../shared/src/business/entities/NewMessage';
import { applicationContextForClient as applicationContext } from '../../../shared/src/business//test/createTestApplicationContext';
import { caseMessageModalHelper as caseMessageModalHelperComputed } from '../../src/presenter/computeds/caseMessageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const { PETITIONS_SECTION } = applicationContext.getConstants();

const caseMessageModalHelper = withAppContextDecorator(
  caseMessageModalHelperComputed,
);

export const createNewCaseMessageOnCase = test => {
  const getHelper = () => {
    return runCompute(caseMessageModalHelper, {
      state: test.getState(),
    });
  };

  return it('user creates new message on a case', async () => {
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
    test.testMessageDocumentId = messageDocument.documentId;

    await test.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: messageDocument.documentId,
    });

    expect(test.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    test.testMessageSubject = `what kind of bear is best? ${Date.now()}`;

    await test.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: test.testMessageSubject,
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
