import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { refreshElasticsearchIndex } from '../helpers';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);
const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();

export const userSendsMessageToJudge = (cerebralTest, subject) => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: cerebralTest.getState(),
    });
  };

  return it('internal user sends message to judgeColvin', async () => {
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
      value: 'dabbad00-18d0-43ec-bafb-654e83405416', //judgeColvin
    });

    const messageDocument = getHelper().documents[0];
    cerebralTest.testMessageDocumentId = messageDocument.docketEntryId;

    await cerebralTest.runSequence('updateMessageModalAttachmentsSequence', {
      documentId: messageDocument.docketEntryId,
    });

    expect(cerebralTest.getState('modal.form.subject')).toEqual(
      messageDocument.documentTitle || messageDocument.documentType,
    );

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'subject',
      value: subject,
    });

    await cerebralTest.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: "don't forget to be awesome",
    });

    await cerebralTest.runSequence('createMessageSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();
  });
};
