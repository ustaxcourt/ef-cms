import { applicationContextForClient as applicationContext } from '../../../shared/src/business//test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();
const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const petitionsClerkCreatesMessageToChambers = cerebralTest => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: cerebralTest.getState(),
    });
  };

  return it('Petitions clerk sends a message to colvinsChambers', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('openCreateMessageModalSequence');

    await cerebralTest.runSequence(
      'updateSectionInCreateMessageModalSequence',
      {
        key: 'toSection',
        value: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
      },
    );

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '9c9292a4-2d5d-45b1-b67f-ac0e1c9b5df5', //colvinsChambers
    });

    const messageDocument = getHelper().documents[0];
    cerebralTest.testMessageDocumentId = messageDocument.docketEntryId;

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: messageDocument.docketEntryId,
    });

    expect(cerebralTest.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    cerebralTest.testMessageSubject = `hi chambers! ${Date.now()}`;

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: cerebralTest.testMessageSubject,
    });

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: 'how ya doin?',
    });

    await cerebralTest.runSequence('createMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
